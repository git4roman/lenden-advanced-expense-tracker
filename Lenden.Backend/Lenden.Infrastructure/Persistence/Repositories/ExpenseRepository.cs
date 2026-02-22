using Lenden.Application.Interfaces.Repositories;
using Lenden.Domain.Entities;
using Lenden.Infrastructure.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

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

    public async Task<ExpenseEntity?> GetByPublicIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _dbContext.Expenses.FirstOrDefaultAsync(e => e.PublicId == id, ct);
    }
}