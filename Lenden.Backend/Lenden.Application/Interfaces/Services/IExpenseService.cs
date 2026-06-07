using Lenden.Application.DTOs;
using Lenden.Application.DTOs.Expense;
using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces.Services;

public interface IExpenseService
{
    Task CreateExpenseAsync(UserEntity creator,CreateExpenseRequest request, CancellationToken ct = default);
    // Task UpdateExpenseAsync(UpdateExpenseRequest request, CancellationToken ct = default);
    Task<IEnumerable<ExpenseEntity>> GetGroupExpensesAsync(Guid groupId, CancellationToken ct = default);
    Task DeleteExpenseAsync(long userId, DeleteExpenseRequest request, CancellationToken ct = default);

    Task UpdateExpense(UpdateExpenseRequest request, CancellationToken ct = default);
}
