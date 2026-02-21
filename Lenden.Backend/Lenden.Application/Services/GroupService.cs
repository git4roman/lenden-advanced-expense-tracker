using Lenden.Application.DTOs;
using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Services;
using Lenden.Application.Managers;
using Lenden.Domain.Entities;

namespace Lenden.Application.Services;

public class GroupService : IGroupService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly GroupManager _groupManager;

    public GroupService(IUnitOfWork unitOfWork, GroupManager groupManager)
    {
        _unitOfWork = unitOfWork;
        _groupManager = groupManager;
    }

    public async Task CreateGroupAsync(CreateGroupRequest request, CancellationToken ct = default)
    {
        var creator = await _unitOfWork.UserRepository.GetUserByPublicIdAsync(request.CreatorUserId, ct);
        if (creator is null)
            throw new Exception("Creator not found");

        var group = new GroupEntity(request.Name, request.ImageUrl, creator.Id);

        group.AddUser(creator); 
        await _unitOfWork.GroupRepository.AddAsync(group, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return;
    }

    public async Task UpdateGroupAsync(Guid groupId, UpdateGroupRequest request, CancellationToken ct = default)
    {
        var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId, ct);
        if (group is null)
            throw new Exception("Group not found");

        group.UpdateInfo(request.Name, request.ImageUrl);

        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task AddMemberAsync(Guid groupId, AddMemberRequest request, CancellationToken ct = default)
    {
      var group= await _groupManager.GetGroupByPublicIdAsync(groupId, ct);
        var user = await _unitOfWork.UserRepository.GetUserByPublicIdAsync(request.UserId, ct);
        if (user is null)
            throw new Exception("User not found");

        group.AddUser(user, user);

        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task LeaveGroupAsync(Guid groupId, Guid userId, CancellationToken ct = default)
    {
        var group= await _groupManager.GetGroupByPublicIdAsync(groupId, ct);
        var user = await _unitOfWork.UserRepository.GetUserByPublicIdAsync(userId, ct);
        group.RemoveUser(user.Id);

        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task DeleteGroupAsync(Guid groupId, CancellationToken ct = default)
    {
        var group= await _groupManager.GetGroupByPublicIdAsync(groupId, ct);
        _unitOfWork.GroupRepository.Remove(group);
        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task<UserEntity?> GetGroupMemberByPublicId(Guid groupId, Guid userId, CancellationToken ct = default)
    {
        var user = await _unitOfWork.GroupRepository.GetGroupMemberByUserPublicIdAsync(groupId,userId, ct);
        if (user is null)
            throw new KeyNotFoundException("User is not a member of the group.");
        return user;
    }

    public async Task<GroupEntity?> GetGroupByPublicIdAsync(Guid groupId, CancellationToken ct = default)
    {
        var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId, ct);
        if (group is null)
            throw new KeyNotFoundException("Group not found.");
        return group;
    }
}