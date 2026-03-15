using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces.Repositories;

public interface IFriendshipRepository
{
    Task<IEnumerable<UserEntity>> GetFriendsAsync(long userId, CancellationToken ct = default);
}