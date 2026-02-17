using Lenden.Application.DTOs;
using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Services;
using Lenden.Application.Managers;
using Lenden.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lenden.Presentation.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
[Authorize]
public class GroupApiController : ControllerBase
{
    private readonly IGroupService _groupService;
    private readonly AppAuthorizationManager _authorizationManager;

    public GroupApiController(IGroupService groupService, AppAuthorizationManager _authorizationManager)
    {
        _groupService = groupService;
        this._authorizationManager = _authorizationManager;
    }

    [HttpPost]
    public async Task<IActionResult> CreateGroup(CreateGroupRequest request, CancellationToken ct = default)
    {
        await _authorizationManager.ValidateUserAsync(User, ct);
        await _groupService.CreateGroupAsync(request);
        return Ok();
    }

    [HttpPut("{groupId:Guid}")]
    public async Task<IActionResult> UpdateGroup(Guid groupId, UpdateGroupRequest request,CancellationToken ct = default)
    {
        await _authorizationManager.ValidateUserAsync(User, ct);
        await _groupService.UpdateGroupAsync(groupId, request);
        return NoContent();
    }

    [HttpPost("{groupId:Guid}/members")]
    public async Task<IActionResult> AddMember(Guid groupId, AddMemberRequest request,CancellationToken ct = default)
    {
        await _authorizationManager.ValidateUserAsync(User, ct);
        await _authorizationManager.EnsureGroupAdminAsync(groupId, User, ct);
        await _groupService.AddMemberAsync(groupId, request);
        return NoContent();
    }

    [HttpPost("{groupId:Guid}/leave")]
    public async Task<IActionResult> LeaveGroup(Guid groupId, Guid userId,CancellationToken ct = default)
    {
        await _authorizationManager.ValidateUserAsync(User, ct);
        await _authorizationManager.EnsureGroupMemberAsync(groupId, User, ct);
        await _groupService.LeaveGroupAsync(groupId, userId);
        return NoContent();
    }

    [HttpDelete("{groupId:Guid}")]
    public async Task<IActionResult> DeleteGroup(Guid groupId,CancellationToken ct = default)
    {
        await _authorizationManager.ValidateUserAsync(User, ct);
        await _authorizationManager.EnsureGroupAdminAsync(groupId, User, ct);
        await _groupService.DeleteGroupAsync(groupId);
        return NoContent();
    }
}
