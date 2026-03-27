using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces.Repositories;

public interface IFriendshipRepository
{
    Task<IEnumerable<UserEntity>> GetFriendsAsync(long userId, CancellationToken ct = default);
    Task<FriendshipEntity> GetFriendshipAsync(long userId,long friendId, CancellationToken ct = default);
    Task AddFriendAsync(FriendshipEntity friendship);
    Task RemoveFriendAsync(long userId, Guid friendId);
}