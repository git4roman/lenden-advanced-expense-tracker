
using Lenden.Domain.Entities;
namespace Lenden.Application.Interfaces.Repositories;

public interface IExpenseRepository
{
  Task AddAsync(ExpenseEntity expense, CancellationToken ct = default);
}
