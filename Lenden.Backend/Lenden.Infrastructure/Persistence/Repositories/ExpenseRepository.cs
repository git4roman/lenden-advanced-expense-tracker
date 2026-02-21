using Lenden.Application.Interfaces.Repositories;
using Lenden.Domain.Entities;
using Lenden.Infrastructure.Persistence.DbContexts;

namespace Lenden.Infrastructure.Persistence.Repositories;

public class ExpenseRepository: IExpenseRepository
{
    private readonly AppDbContext _dbContext;
    public ExpenseRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(ExpenseEntity expense, CancellationToken ct = default)
    {
        await _dbContext.Expenses.AddAsync(expense, ct);
    }
}