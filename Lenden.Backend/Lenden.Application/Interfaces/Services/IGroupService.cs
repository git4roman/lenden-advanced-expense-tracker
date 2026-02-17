using Lenden.Application.DTOs;

namespace Lenden.Application.Interfaces.Services;

public interface IGroupService
{
    Task CreateGroupAsync(CreateGroupRequest request, CancellationToken ct = default);

    Task UpdateGroupAsync(Guid groupId, UpdateGroupRequest request, CancellationToken ct = default);

    Task AddMemberAsync(Guid groupId, AddMemberRequest request, CancellationToken ct = default);

    Task LeaveGroupAsync(Guid groupId, Guid userId, CancellationToken ct = default);

    Task DeleteGroupAsync(Guid groupId, CancellationToken ct = default);
}