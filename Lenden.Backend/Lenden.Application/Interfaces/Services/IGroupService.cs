using Lenden.Application.DTOs;
using Lenden.Application.Services;
using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces.Services;

public interface IGroupService
{
    Task CreateGroupAsync(UserEntity Creator, CreateGroupRequest request, CancellationToken ct = default);

    Task UpdateGroupAsync(Guid groupId, UpdateGroupRequest request, CancellationToken ct = default);

    Task AddMemberAsync(Guid groupId, AddMemberRequestDto requestDto, long invitedByUserId, CancellationToken ct = default);

    Task LeaveGroupAsync(Guid groupId, long userId, CancellationToken ct = default);
    
    Task RemoveMemberAsync(Guid groupId, Guid memberId, long userId, CancellationToken ct = default);

    Task DeleteGroupAsync(Guid groupId,long userId, CancellationToken ct = default);
    
    Task<IEnumerable<GroupEntity>> GetAllActiveAsync(CancellationToken ct = default);
    Task<List<GroupService.Transaction>> GetBalance(Guid groupId, CancellationToken ct = default);
    
    // Task<UserEntity?> GetGroupMemberByPublicId(Guid groupId, Guid userId, CancellationToken ct = default);
    
    Task<GroupEntity?> GetGroupByPublicIdAsync(Guid groupId, CancellationToken ct = default);
    Task<IEnumerable<GroupEntity?>> GetGroupsByUserIdAsync(Guid userId, CancellationToken ct = default);
}