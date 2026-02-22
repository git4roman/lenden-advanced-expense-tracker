
using Lenden.Domain.Entities;
namespace Lenden.Application.Interfaces.Repositories;

public interface IExpenseRepository
{
    Task AddAsync(ExpenseEntity expense, CancellationToken ct = default);
    Task<ExpenseEntity?> GetByPublicIdAsync(Guid id, CancellationToken ct = default);
}
