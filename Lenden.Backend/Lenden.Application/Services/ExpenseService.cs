using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Services;
using Lenden.Domain.Entities;
using Lenden.Application.DTOs;
using Lenden.Application.Interfaces.Validators;
using Lenden.Web.Models.Exceptions;
using Lenden.Application.DTOs.Expense;
using Lenden.Domain.ValueObjects;
using Repayments = Lenden.Domain.ValueObjects.Repayments;

namespace Lenden.Application.Services;

public class ExpenseService : IExpenseService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IGroupService _groupService;
    private readonly IGroupValidators _groupValidator;

    public ExpenseService(IUnitOfWork unitOfWork, IGroupService groupService, IGroupValidators groupValidator)
    {
        _unitOfWork = unitOfWork;
        _groupService = groupService;
        _groupValidator = groupValidator;
    }

    public async Task CreateExpenseAsync(UserEntity creator, CreateExpenseRequest request, CancellationToken ct = default)
    {
        using var transaction = await _unitOfWork.BeginTransactionAsync(ct);
        
        try
        {
            var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(request.GroupPublicId, ct);
            if (group is null) throw new NotFoundException("Group not found");
            
            const decimal tolerance = 0.01m;

            decimal totalPaid = request.Users.Sum(u => u.PaidAmount);
            decimal totalSplit = request.Users.Sum(u => u.SplitAmount);

            if (Math.Abs(totalPaid - request.Amount) > tolerance ||
                Math.Abs(totalSplit - request.Amount) > tolerance)
            {
                throw new BadRequestException("Total does not match amount");
            }

            // var userBalances = group.UserBalances;
            var publicIds = request.Users
                .Select(x => x.UserId)
                .Distinct()
                .ToList();

            var users = await _unitOfWork.UserRepository.GetUsersIdsInBulkWithPublicIdAsync(publicIds, ct);
            var userMap = users.ToDictionary(x => x.PublicId, x => x.UserId);

            var receipt = new Receipt(request?.Receipt ?? "", request?.Receipt ?? "");

            var repayments = new List<Repayments>();

            var creditors = request?.Users.Where(u => u.NetAmount > 0).Select(u => u).ToList();
            var debtors = request?.Users.Where(u => u.NetAmount < 0).Select(u => u).ToList();
            for (int i=0; i<=debtors?.Count;i++ )
            {
                var creditor = creditors[i];
                for (int j = 0; j <= creditors?.Count; j++)
                {
                    var debtor = debtors[j];
                    var amount = Math.Min(creditor.NetAmount, -debtor.NetAmount);
                    
                    repayments.Add(new Repayments(debtor.UserId,creditor.UserId,amount));
                    
                    debtor.NetAmount += amount;
                    creditor.NetAmount -= amount;
                    if (debtor.NetAmount == 0) j++;
                    if (creditor.NetAmount == 0) i++;
                }
            }
            var expenseEntity = ExpenseEntity.Create(
                creator,
                group,
                request.Amount,
                request.Category,
                request.Date,
                request.Description,
                receipt,
                request.CreationMethod,
                repayments
            );

            foreach (var x in request.Users)
            {
                var userId = userMap[x.UserId];
                var paidAmount = x.PaidAmount;
                var splitAmount = x.SplitAmount;
                expenseEntity.AddExpenseParticipant(
                    userId: userMap[x.UserId],
                    paid: paidAmount,
                    split: splitAmount
                );
                var member = group.Members.FirstOrDefault(m => m.UserId == userId);
                if (member is null) continue;
                member.UpdateNetBalance(paidAmount-splitAmount);
                
            }
            await _unitOfWork.ExpenseRepository.AddAsync(expenseEntity, ct);
            await _unitOfWork.SaveChangesAsync(ct);
            await transaction.CommitAsync();
        }
        catch (Exception e)
        {
            await transaction.RollbackAsync(ct);
            throw new Exception(e.InnerException?.Message ?? e.Message);
        }
    }
    
   

    public async Task<IEnumerable<ExpenseEntity?>> GetGroupExpensesAsync(Guid groupId, CancellationToken ct = default)
    {
        return await _unitOfWork.ExpenseRepository.GetByGroupAsync(groupId);
    }

    public async Task DeleteExpenseAsync(long userId, DeleteExpenseRequest request, CancellationToken ct = default)
    {
        var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(request.GroupPublicId, ct);

        if (group is null) throw new NotFoundException("Group not found");
        var expense = await _unitOfWork.ExpenseRepository.GetByPublicIdAsync(request.ExpensePublicId, ct);
        if(expense is null) throw new NotFoundException("Expense not found");

        var groupMembers = group.Members;
        var expenseParticipants=expense.Participants;

        foreach (var expenseParticipant in expenseParticipants)
        {
            foreach (var groupMember in groupMembers)
            {
                if (expenseParticipant.UserId == groupMember.UserId)
                {
                    var expenseNetBalance = expenseParticipant.Split - expenseParticipant.Paid;
                    groupMember.UpdateNetBalance(expenseNetBalance);
                }
            }
        }
        
        await _unitOfWork.ExpenseRepository.RemoveExpenseAsync(expense.Slug, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        

    }

   public async Task UpdateExpense(UpdateExpenseRequest request, CancellationToken ct = default)
{
    var totalPaid = request.Users.Sum(u => u.PaidAmount);
    var totalSplit = request.Users.Sum(u => u.SplitAmount);

    if (totalPaid != request.TotalAmount || totalSplit != request.TotalAmount)
        throw new Exception("Paid and split amounts must each equal the total amount.");

    var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(request.GroupPublicId, ct);


    var expense = await _unitOfWork.ExpenseRepository.GetByPublicIdAsync(request.ExpensePublicId, ct)
        ?? throw new Exception("Expense not found.");

    var publicIds = request.Users.Select(u => u.UserId).Distinct().ToList();
    var users = await _unitOfWork.UserRepository.GetUsersIdsInBulkWithPublicIdAsync(publicIds, ct);

    var userMap = users.ToDictionary(u => u.PublicId, u => u.UserId);
    var memberMap = group.Members.ToDictionary(m => m.UserId, m => m);

    expense.UpdateExpense(request.TotalAmount, request.Category, request.Description, new Receipt(request.ImageUrl,request.ImageUrl));

    var existingParticipants = expense.Participants
        .GroupBy(p => p.UserId)
        .ToDictionary(g => g.Key, g => g.First());

    var incomingParticipants = request.Users
        .GroupBy(u => userMap[u.UserId])
        .ToDictionary(g => g.Key, g => g.Last());

    foreach (var (userId, dto) in incomingParticipants)
    {
        if (existingParticipants.TryGetValue(userId, out var existing))
        {
            if (memberMap.TryGetValue(userId, out var member))
                member.UpdateNetBalance(-existing.Net);

            existing.Update(dto.PaidAmount, dto.SplitAmount);

            if (memberMap.TryGetValue(userId, out member))
                member.UpdateNetBalance(existing.Net);
        }
        else
        {
            expense.AddExpenseParticipant(userId, dto.PaidAmount, dto.SplitAmount);

            if (memberMap.TryGetValue(userId, out var member))
                member.UpdateNetBalance(dto.PaidAmount - dto.SplitAmount);
        }
    }

    var toRemove = existingParticipants.Keys
        .Except(incomingParticipants.Keys)
        .ToList();

    foreach (var userId in toRemove)
    {
        var participant = existingParticipants[userId];

        if (memberMap.TryGetValue(userId, out var member))
            member.UpdateNetBalance(participant.Split - participant.Paid);

        expense.RemoveParticipant(participant);
    }
    

    await _unitOfWork.SaveChangesAsync(ct);
}
}
