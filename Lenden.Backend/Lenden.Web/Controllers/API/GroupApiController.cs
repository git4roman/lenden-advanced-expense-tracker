using Lenden.Application.DTOs;
using Lenden.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lenden.Web.Controllers.API;

[Route("api/v1/group")]
[ApiController]
[Authorize]
public class GroupApiController : ControllerBase
{
    private readonly IGroupService _groupService;
    private readonly IAuthService _authService;

    public GroupApiController(IGroupService groupService, IAuthService authService)
    {
        _groupService = groupService;
        _authService = authService;
    }

    [HttpGet]
    public async Task<IActionResult> GetGroups(CancellationToken ct = default)
    {
        var currentUser = await _authService.ValidateUserAsync(User, ct);
        var groups = await _groupService.GetGroupsByUserIdAsync(currentUser.PublicId,ct);
        return Ok(groups);
    }

    [HttpPost]
    public async Task<IActionResult> CreateGroup(CreateGroupRequest request, CancellationToken ct = default)
    {
        var currentUser = await _authService.ValidateUserAsync(User, ct);
        
        await _groupService.CreateGroupAsync(currentUser.PublicId,request);
        return Ok();
    }

    [HttpPut("{groupId:Guid}")]
    public async Task<IActionResult> UpdateGroup(Guid groupId, UpdateGroupRequest request,CancellationToken ct = default)
    {
        await _authService.ValidateUserAsync(User, ct);
        await _groupService.UpdateGroupAsync(groupId, request);
        return NoContent();
    }

    [HttpPost("{groupId:Guid}/members")]
    public async Task<IActionResult> AddMember(Guid groupId, AddMemberRequestDto requestDto,CancellationToken ct = default)
    {
        var currentUser = await _authService.ValidateUserAsync(User, ct);
        // await _groupManager.EnsureGroupAdminAsync(groupId, User, ct);
        await _groupService.AddMemberAsync(groupId, requestDto, currentUser.Id);
        return NoContent();
    }

    // [HttpPost("{groupId:Guid}/leave")]
    // public async Task<IActionResult> LeaveGroup(Guid groupId, Guid userId,CancellationToken ct = default)
    // {
    //     await _authService.ValidateUserAsync(User, ct);
    //     // await _groupManager.EnsureCurrentUserIsGroupMemberAsync(groupId, User, ct);
    //     await _groupService.LeaveGroupAsync(groupId, userId);
    //     return NoContent();
    // }

    [HttpDelete("{groupId:Guid}")]
    public async Task<IActionResult> DeleteGroup(Guid groupId,CancellationToken ct = default)
    {
        await _authService.ValidateUserAsync(User, ct);
        // await _groupManager.EnsureGroupAdminAsync(groupId, User, ct);
        await _groupService.DeleteGroupAsync(groupId);
        return NoContent();
    }
}
