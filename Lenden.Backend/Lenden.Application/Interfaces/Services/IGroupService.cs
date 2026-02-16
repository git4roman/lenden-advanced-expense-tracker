using Lenden.Application.DTOs;

namespace Lenden.Application.Interfaces.Services;

public interface IGroupService
{
    Task CreateGroupAsync(CreateGroupRequest request, CancellationToken ct = default);

    Task UpdateGroupAsync(long groupId, UpdateGroupRequest request, CancellationToken ct = default);

    Task AddMemberAsync(long groupId, AddMemberRequest request, CancellationToken ct = default);

    Task LeaveGroupAsync(long groupId, Guid userId, CancellationToken ct = default);

    Task DeleteGroupAsync(long groupId, CancellationToken ct = default);
}