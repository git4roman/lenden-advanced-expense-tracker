using Lenden.Application.DTOs;
using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Services;
using Lenden.Domain.Entities;

namespace Lenden.Application.Services;

public class GroupService : IGroupService
{
    private readonly IUnitOfWork _unitOfWork;

    public GroupService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task CreateGroupAsync(CreateGroupRequest request, CancellationToken ct = default)
    {
        var creator = await _unitOfWork.UserRepository.GetUserByUserIdAsync(request.CreatorUserId, ct);
        if (creator is null)
            throw new Exception("Creator not found");

        var group = new GroupEntity(request.Name, request.ImageUrl, creator.Id);

        group.AddUser(creator); // default admin

        await _unitOfWork.GroupRepository.AddAsync(group, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return;
    }

    public async Task UpdateGroupAsync(long groupId, UpdateGroupRequest request, CancellationToken ct = default)
    {
        var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId, ct);
        if (group is null)
            throw new Exception("Group not found");

        group.UpdateInfo(request.Name, request.ImageUrl);

        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task AddMemberAsync(long groupId, AddMemberRequest request, CancellationToken ct = default)
    {
        var group = await _unitOfWork.GroupRepository.GetByIdAsync(groupId, ct);
        if (group is null)
            throw new Exception("Group not found");

        var user = await _unitOfWork.UserRepository.GetUserByUserIdAsync(request.UserId, ct);
        if (user is null)
            throw new Exception("User not found");

        group.AddUser(user, user);

        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task LeaveGroupAsync(long groupId, Guid userId, CancellationToken ct = default)
    {
        var group = await _unitOfWork.GroupRepository.GetByIdAsync(groupId, ct);
        if (group is null)
            throw new Exception("Group not found");
        
        var user = await _unitOfWork.UserRepository.GetUserByUserIdAsync(userId, ct);

        group.RemoveUser(user.Id);

        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task DeleteGroupAsync(long groupId, CancellationToken ct = default)
    {
        var group = await _unitOfWork.GroupRepository.GetByIdAsync(groupId, ct);
        if (group is null)
            throw new Exception("Group not found");

        _unitOfWork.GroupRepository.Remove(group);

        await _unitOfWork.SaveChangesAsync(ct);
    }
}