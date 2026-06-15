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
        return await _dbContext.Expenses.Include(e=>e.Participants).FirstOrDefaultAsync(e => e.Slug == id, ct);
    }

    public async Task<IEnumerable<ExpenseEntity>> GetByGroupAsync(Guid groupId, CancellationToken ct = default)
    {
        var expenses = await _dbContext.Expenses.Include(p=>p.Group).Include(p=>p.Participants).ThenInclude(p=>p.User).Include(e=>e.Creator).Include(e=>e.Repayments).Include(e=>e.Receipt).Include(e=>e.Repayments).Include(e=>e.Receipt).Where(e=>e.Group.Slug == groupId).ToListAsync(ct);
        return expenses;
    }
    
    public async Task RemoveExpenseAsync(Guid id, CancellationToken ct = default)
    {
        var expense = await _dbContext.Expenses.FirstOrDefaultAsync(e => e.Slug == id, ct);
        if(expense != null) _dbContext.Expenses.Remove(expense);
    }
    
    public async Task DeleteParticipantsAsync(Guid expensePublicId, CancellationToken ct = default)
    {
        var participants = await _dbContext.ExpenseParticipants
            .Where(p => p.Expense.Slug == expensePublicId)
            .ToListAsync(ct);

        _dbContext.ExpenseParticipants.RemoveRange(participants);
    }
}