using Lenden.Application.DTOs;
using Lenden.Application.DTOs.Group;
using Lenden.Application.Services;
using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces.Services;

public interface IGroupService
{
    Task CreateGroupAsync(UserEntity creator, CreateGroupRequestDto request, CancellationToken ct = default);

    Task UpdateGroupAsync(Guid groupId, UpdateGroupRequestDto requestDto, CancellationToken ct = default);

    Task AddMemberAsync(Guid groupId, AddGroupMemberRequestDto requestDto, long invitedByUserId, CancellationToken ct = default);

    Task LeaveGroupAsync(Guid groupId, long userId, CancellationToken ct = default);
    
    Task RemoveMemberAsync(Guid groupId, Guid memberId, long userId, CancellationToken ct = default);

    Task DeleteGroupAsync(Guid groupId,long userId, CancellationToken ct = default);
    
    Task<IEnumerable<GroupEntity>> GetAllActiveAsync(CancellationToken ct = default);
    Task<List<GroupMembersBalanceResponseDto>> GetGroupBalance(Guid groupId, CancellationToken ct = default);

    List<GroupMembersBalanceResponseDto> GetBalance(GroupEntity group, CancellationToken ct=default);
    
    // Task<UserEntity?> GetGroupMemberByPublicId(Guid groupId, Guid userId, CancellationToken ct = default);
    
    Task<GroupResponseDto?> GetGroupByPublicIdAsync(Guid groupId, CancellationToken ct = default);
    Task<IEnumerable<GroupsResponseDto?>> GetGroupsByUserIdAsync(Guid userId, CancellationToken ct = default);
}