using Lenden.Application.DTOs;
using Lenden.Application.DTOs.Expense;
using Lenden.Application.Interfaces.Services;
using Lenden.Application.Managers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lenden.Web.Controllers.API;

[Route("api/v1/expense")]
[ApiController]
[Authorize]
public class ExpenseApiController : ControllerBase
{
    private readonly IExpenseService _expenseService;
    private readonly AuthManager _authManager;
    private readonly IAuthService _authService;

    public ExpenseApiController(
        IExpenseService expenseService,
        AuthManager authManager,
        IAuthService authService)
    {
        _expenseService = expenseService;
        _authManager = authManager;
        _authService = authService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateExpense(
        CreateExpenseRequest request,
        CancellationToken ct = default)
    {
        try
        {
            var currentUser = await _authService.ValidateUserAsync(User, ct);
            await _expenseService.CreateExpenseAsync(currentUser.Id, request, ct);
            return Ok();
        }
        catch (System.Exception e)
        {

            throw new Exception(e.Message);
        }
    } 
    
    [HttpDelete]
    public async Task<IActionResult> DeleteExpense(
        DeleteExpenseRequest request,
        CancellationToken ct = default)
    {
        try
        {
            var currentUser = await _authService.ValidateUserAsync(User, ct);
            await _expenseService.DeleteExpenseAsync(currentUser.Id, request, ct);
            return Ok();
        }
        catch (System.Exception e)
        {

            throw new Exception(e.Message);
        }
    }

    [HttpGet("{groupId:Guid}")]
    public async Task<IActionResult> GetGroupExpenses(
        Guid groupId,
        CancellationToken ct = default)
    {
        var result = await _expenseService.GetGroupExpensesAsync(groupId, ct);
        var response = result.Select(r =>
            new GroupExpenseResponseDto
            {
                Id = r.Slug,
                Cost = r.Cost,
                Users = r.Participants.Select(p => new Users
                {
                   Id= p.User.Slug,
                   Email = p.User.Email.Value,
                   GivenName = p.User.GivenName,
                   FamilyName = p.User.FamilyName,
                   Avatar= p.User.UserInfo.ImageUrl,
                   PaidAmount= p.Paid,
                   NetBalance= p.Net,
                   SplitAmount=p.Split,

                }).ToList(),
                CategoryKey = r.Category.Name,
                Date =r.Date,
                CreatedAt = r.CreatedAt,
                UpdatedAt=r.UpdatedAt,
                Receipt= r.Receipt,
            });
        return Ok(response);
    }

    [HttpPost("{id:guid}/edit")]
    public async Task<IActionResult> UpdateExpense(UpdateExpenseRequest dto)
    {
        try
        {
            var currentUser = await _authService.ValidateUserAsync(User);
            if (currentUser == null) return Unauthorized();

            await _expenseService.UpdateExpense(dto);
            return Ok();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }

    }


}