using System.Security.Claims;
using Lenden.Application.Interfaces;
using Lenden.Domain.Entities;

namespace Lenden.Application.Managers;

public class GroupManager
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly AuthManager _authManager;

    public GroupManager(IUnitOfWork unitOfWork, AuthManager authManager)
    {
        _unitOfWork = unitOfWork;
        _authManager = authManager;
    }
    
    public async Task EnsureGroupAdminAsync(Guid groupId, ClaimsPrincipal userClaims, CancellationToken ct = default)
    {
        var user = await _authManager.ValidateUserAsync(userClaims, ct);
        var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId, ct);

        if (!group.UserGroups.Any(ug => ug.UserId == user.Id && 
                                        ug.Role == UserGroupRole.Admin && 
                                        ug.Status == MembershipStatus.Active))
        {
            throw new UnauthorizedAccessException("User is not a group admin.");
        }
    }
    
    public async Task EnsureGroupMemberAsync(Guid groupId, ClaimsPrincipal userClaims, CancellationToken ct = default)
    {
        var user = await _authManager.ValidateUserAsync(userClaims, ct);
        var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId, ct);
        if (group == null)
            throw new KeyNotFoundException("Group not found.");

        if (!group.UserGroups.Any(ug => ug.UserId == user.Id &&
                                        ug.Status == MembershipStatus.Active))
        {
            throw new UnauthorizedAccessException("User is not a member of the group.");
        }
    }
    
    public async Task<GroupEntity> GetGroupByPublicIdAsync(Guid groupId, CancellationToken ct = default)
    {
        var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId, ct);
        if (group is null)
            throw new KeyNotFoundException("Group not found.");
        return group;
    }
 
}