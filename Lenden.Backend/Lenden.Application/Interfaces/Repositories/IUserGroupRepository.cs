namespace Lenden.Application.Interfaces.Repositories;

public interface IUserGroupRepository
{
    Task EnsureUserInGroupAndActiveAsync( Guid groupId,Guid userId, CancellationToken ct = default);
}