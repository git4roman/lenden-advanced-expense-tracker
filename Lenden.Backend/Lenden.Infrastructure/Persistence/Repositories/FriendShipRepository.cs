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
}