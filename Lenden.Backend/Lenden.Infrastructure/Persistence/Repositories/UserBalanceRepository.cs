using Lenden.Application.Interfaces.Repositories;
using Lenden.Infrastructure.Persistence.DbContexts;

namespace Lenden.Infrastructure.Persistence.Repositories;

using Lenden.Application.Interfaces;
using Lenden.Domain.Entities;
using Microsoft.EntityFrameworkCore;

public class UserBalanceRepository : IUserBalanceRepository
{
    private readonly AppDbContext _context;

    public UserBalanceRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserBalanceEntity?> GetByUsersAsync(
        Guid groupId,
        long userId1,
        long userId2,
        CancellationToken ct = default)
    {
        var (minId, maxId) = userId1 < userId2
            ? (userId1, userId2)
            : (userId2, userId1);

        return await _context.UserBalances
            .FirstOrDefaultAsync(x =>
                    x.GroupPublicId == groupId &&
                    x.CreditorId == minId &&
                    x.DebtorId == maxId,
                ct);
    }

    public async Task<List<UserBalanceEntity>> GetByGroupAsync(
        Guid groupId,
        CancellationToken ct = default)
    {
        return await _context.UserBalances
            .Where(x => x.GroupPublicId == groupId)
            .ToListAsync(ct);
    }

    public async Task AddAsync(UserBalanceEntity balance, CancellationToken ct = default)
    {
        await _context.UserBalances.AddAsync(balance, ct);
    }

    public void Remove(UserBalanceEntity balance)
    {
        _context.UserBalances.Remove(balance);
    }

    public async Task<IEnumerable<UserBalanceEntity>> GetByGroupPublicIdAsync(Guid groupId, CancellationToken ct = default)
    {
        var balances = await _context.UserBalances.Where(x => x.GroupPublicId == groupId).ToListAsync(ct);
            return balances;
    }
}
