using Lenden.Application.Interfaces.Repositories;
using Lenden.Domain.Entities;
using Lenden.Infrastructure.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Lenden.Infrastructure.Persistence.Repositories;

public class FriendShipRepository: IFriendshipRepository
{
    private readonly AppDbContext _dbContext;
    public FriendShipRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<IEnumerable<UserEntity>> GetFriendsAsync(long userId, CancellationToken ct = default)
    {
        return await _dbContext.Friends
            .Where(f => (f.RecipientId == userId || f.RequesterId == userId)
                        && f.Status == FriendshipStatus.Accepted)
            .Select(f => f.RequesterId == userId ? f.Recipient : f.Requester)
            .ToListAsync(ct);
    }

    public async Task<FriendshipEntity?> GetFriendshipAsync(long userId, long friendId, CancellationToken ct = default)
    {
        return await _dbContext.Friends
            .FirstOrDefaultAsync(f =>
                    ((f.RecipientId == userId && f.RequesterId == friendId) ||
                     (f.RequesterId == userId && f.RecipientId == friendId)),
                ct);
    }

    public async Task AddFriendAsync(FriendshipEntity friendship)
    {
        await _dbContext.Friends.AddAsync(friendship);
    }

    public async Task RemoveFriendAsync(long userId, Guid friendId)
    {
        throw new NotImplementedException();
    }
}