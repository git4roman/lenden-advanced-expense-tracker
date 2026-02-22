using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces.Repositories;

public interface IGroupRepository
{
    Task AddAsync(GroupEntity group, CancellationToken ct = default);

    Task<GroupEntity?> GetByIdAsync(long id, CancellationToken ct = default);
    Task<GroupEntity?> GetByPublicIdAsync(long id, CancellationToken ct = default);

    Task<GroupEntity?> GetByPublicIdAsync(Guid publicId, CancellationToken ct = default);

    Task<bool> ExistsAsync(long id, CancellationToken ct = default);

    void Remove(GroupEntity group);
    
    // Task<UserEntity?> GetGroupMemberByUserPublicIdAsync(Guid groupId, Guid userId, CancellationToken ct = default);
   
}