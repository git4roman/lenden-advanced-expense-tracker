using Lenden.Application.DTOs;
using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces.Services;

public interface IGroupService
{
    Task CreateGroupAsync(Guid CreatorId, CreateGroupRequest request, CancellationToken ct = default);

    Task UpdateGroupAsync(Guid groupId, UpdateGroupRequest request, CancellationToken ct = default);

    Task AddMemberAsync(Guid groupId, AddMemberRequestDto requestDto, long invitedByUserId, CancellationToken ct = default);

    Task LeaveGroupAsync(Guid groupId, long userId, CancellationToken ct = default);
    
    Task RemoveMemberAsync(Guid groupId, Guid memberId, long userId, CancellationToken ct = default);

    Task DeleteGroupAsync(Guid groupId,long userId, CancellationToken ct = default);
    
    // Task<UserEntity?> GetGroupMemberByPublicId(Guid groupId, Guid userId, CancellationToken ct = default);
    
    Task<GroupEntity?> GetGroupByPublicIdAsync(Guid groupId, CancellationToken ct = default);
    Task<IEnumerable<GroupEntity?>> GetGroupsByUserIdAsync(Guid userId, CancellationToken ct = default);
}