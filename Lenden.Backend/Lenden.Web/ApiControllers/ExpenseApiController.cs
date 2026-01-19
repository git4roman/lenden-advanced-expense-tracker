using Lenden.Core;
using Lenden.Core.BalanceFeatures;
using Lenden.Core.ExpenseFeatures;
using Lenden.Core.Utilities;
using Lenden.Data.DbContexts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lenden.Web.ApiControllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ExpenseApiController: ControllerBase
{
    private readonly IUnitOfWork  _uow;
    private readonly AppDbContext _context;
    private readonly CurrentUserHelper  _currentUserHelper;
    public ExpenseApiController(IUnitOfWork uow, AppDbContext context, CurrentUserHelper currentUserHelper)
    {
        _uow = uow;
        _context = context;
        _currentUserHelper = currentUserHelper;
    }

    public class ExpenseDto
    {
        public int GroupId { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public List<UserAmountDto> PaidByDto { get; set; } = new();
        public List<UserAmountDto> SplitBetweenDto { get; set; } = new();
        public int MadeById { get; set; }
    }

    public class UserAmountDto
    {
        public int UserId { get; set; }
        public decimal Amount { get; set; }
    }


    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateExpense([FromBody] ExpenseDto dto)
    {
        var allUserIds = dto.PaidByDto.Select(u => u.UserId)
            .Concat(dto.SplitBetweenDto.Select(u => u.UserId))
            .Distinct();
        
        var userIds = allUserIds.ToList();
        var existingUserIds = await _context.Users
            .Where(u => userIds.Contains(u.Id))
            .Select(u => u.Id)
            .ToListAsync();

        if (existingUserIds.Count != userIds.Count)
            return NotFound("One or more users not found");
        var balances = await _context.Balances.Where(u => u.GroupId == dto.GroupId).ToListAsync();
        
        var splitCount = dto.SplitBetweenDto.Count;
        
        await using var transaction = await _context.Database.BeginTransactionAsync();
        
        try
        {
            var expense = new ExpenseEntity(dto.MadeById, dto.Description, dto.Amount, dto.GroupId);
            await _uow.Expense.AddAsync(expense);
            await _uow.SaveChangesAsync();
            

            foreach (var payer in dto.PaidByDto)
            {
                var expensePayer = new ExpensePayerEntity(expense.Id, payer.UserId, payer.Amount);
                await _uow.Expense.AddExpensePayer(expensePayer);

                foreach (var splitter in dto.SplitBetweenDto)
                {
                    var expenseSplitter = new ExpenseSplitEntity(expense.Id, splitter.UserId, splitter.Amount);
                    await _uow.Expense.AddExpenseSplitter(expenseSplitter);

                    if (splitter.UserId == payer.UserId)
                    {
                        continue;
                    }

                    var owedToId = Math.Min(payer.UserId, splitter.UserId);
                    var owedById = Math.Max(payer.UserId, splitter.UserId);
                    var existingBalance = balances.FirstOrDefault(u =>
                        u.OwedToId == owedToId && u.OwedById == owedById);
                    if (existingBalance != null)
                    {
                        if (payer.UserId == existingBalance.OwedToId)
                        {
                            existingBalance.Amount += payer.Amount/splitCount;
                        }
                        else
                        {
                            existingBalance.Amount -= payer.Amount/splitCount;;
                        }
                    }
                    else
                    {
                        
                        var newBalance = new BalanceEntity(dto.GroupId, owedToId, owedById,
                            (payer.Amount / splitCount));
                        await _uow.Balance.AddAsync(newBalance);
                    }

                } 
            }
            await _uow.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok();
        }
        catch (Exception e)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    [Authorize]
[HttpGet("transactions/{groupId}")]
public async Task<IActionResult> GetTransactions(int groupId)
{
    var group = await _uow.Group.GetByIdAsync(groupId);
    if (group == null)
        return NotFound($"Group with id {groupId} doesn't exist");

    var expenses = await _context.Expenses
        .AsNoTracking()
        .Where(e => e.GroupId == groupId)
        .Select(e => new
        {
            e.Id,
            e.Description,
            e.GroupId,
            e.MadeById,
            MadeBy = new { e.MadeBy.Id, e.MadeBy.FullName },
            e.Amount,
            e.CreatedAt,
            e.CreatedDate,
            Payers = e.ExpensePayers.Select(ep => new
            {
                ep.PayerId,
                Payer = new { ep.Payer.Id, ep.Payer.FullName },
                ep.Amount
            }).ToList()
        })
        .ToListAsync();

    var settlements = await _context.Settlements
        .AsNoTracking()
        .Where(s => s.GroupId == groupId)
        .Select(s => new
        {
            s.Id,
            s.GroupId,
            s.Amount,
            s.CreatedAt,
            s.CreatedDate,
            FromUser = new { s.FromUser.Id, s.FromUser.FullName },
            ToUser = new { s.ToUser.Id, s.ToUser.FullName }
        })
        .ToListAsync();
    
    return Ok(new {expenses = expenses, settlements = settlements});
}

    
}