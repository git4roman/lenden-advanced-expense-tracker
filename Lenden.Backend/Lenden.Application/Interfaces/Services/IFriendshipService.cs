using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces.Services;

public interface IFriendshipService
{
    Task<IEnumerable<UserEntity>> GetFriendsAsync(long userId);
}