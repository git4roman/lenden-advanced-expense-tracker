using Lenden.Application.DTOs;
using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces.Services;

public interface IExpenseService
{
    Task CreateExpenseAsync(long creatorId,CreateExpenseRequest request, CancellationToken ct = default);
    // Task UpdateExpenseAsync(UpdateExpenseRequest request, CancellationToken ct = default);
    Task<IEnumerable<ExpenseEntity>> GetGroupExpensesAsync(Guid groupId, CancellationToken ct = default);
    // Task DeleteExpenseAsync(Guid expenseId, CancellationToken ct = default);
}
