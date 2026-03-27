using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces.Services;

public interface IFriendshipService
{
    Task<IEnumerable<UserEntity>> GetFriendsAsync(long userId);
    Task AddFriendAsync(long userId, Guid friendId);
    Task AcceptFriendRequestAsync(long userId, Guid friendId);
    Task RemoveFriendAsync(long userId, Guid friendId);
    Task<bool> IsFriendAsync(long userId, Guid friendId);
    
}