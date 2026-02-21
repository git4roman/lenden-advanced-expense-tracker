using Lenden.Application.DTOs;
using Lenden.Application.Interfaces.Services;
using Lenden.Application.Managers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lenden.Presentation.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
[Authorize]
public class ExpenseApiController : ControllerBase
{
    private readonly IExpenseService _expenseService;
    private readonly AuthManager _authManager;
    private readonly GroupManager _groupManager;
    private readonly IAuthService _authService;

    public ExpenseApiController(
        IExpenseService expenseService,
        AuthManager authManager,
        GroupManager groupManager, IAuthService authService)
    {
        _expenseService = expenseService;
        _authManager = authManager;
        _groupManager = groupManager;
        _authService = authService;
    }

    [HttpPost("{groupId:Guid}")]
    public async Task<IActionResult> CreateExpense(
        Guid groupId,
        CreateExpenseRequest request,
        CancellationToken ct = default)
    {
        var currentUser = await _authService.ValidateUserAsync(User, ct);
        // await _groupManager.GetGroupByPublicIdAsync(groupId, ct);
        await _groupManager.EnsureCurrentUserIsGroupMemberAsync(groupId, User, ct);
        
        //create expense transaction
        await _expenseService.CreateExpenseAsync(request, ct);

        return Ok();
    }

    // Get all expenses of a group
    [HttpGet("{groupId:Guid}")]
    public async Task<IActionResult> GetGroupExpenses(
        Guid groupId,
        CancellationToken ct = default)
    {
        await _authService.ValidateUserAsync(User, ct);
        await _groupManager.EnsureCurrentUserIsGroupMemberAsync(groupId, User, ct);

        var result = await _expenseService.GetGroupExpensesAsync(groupId, ct);
        return Ok(result);
    }

    // Delete expense
    [HttpDelete("{expenseId:Guid}")]
    public async Task<IActionResult> DeleteExpense(
        Guid expenseId,
        CancellationToken ct = default)
    {
        await _authService.ValidateUserAsync(User, ct);

        await _expenseService.DeleteExpenseAsync(expenseId, ct);
        return NoContent();
    }
}