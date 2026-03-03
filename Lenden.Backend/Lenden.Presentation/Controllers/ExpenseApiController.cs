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

    [HttpPost("{groupId:Guid}")]
    public async Task<IActionResult> CreateExpense(
        Guid groupId,
        CreateExpenseRequest request,
        CancellationToken ct = default)
    {
        var currentUser = await _authService.ValidateUserAsync(User, ct);
        await _expenseService.CreateExpenseAsync(request, ct);
        return Ok();
    }
    
    [HttpGet("{groupId:Guid}")]
    public async Task<IActionResult> GetGroupExpenses(
        Guid groupId,
        CancellationToken ct = default)
    {
        var result = await _expenseService.GetGroupExpensesAsync(groupId, ct);
        return Ok(result);
    }
    
   
}