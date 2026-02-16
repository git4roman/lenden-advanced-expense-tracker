using Lenden.Application.DTOs;
using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Services;
using Lenden.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Lenden.Presentation.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class GroupApiController : ControllerBase
{
    private readonly IGroupService _groupService;

    public GroupApiController(IGroupService groupService)
    {
        _groupService = groupService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateGroup(CreateGroupRequest request)
    {
        await _groupService.CreateGroupAsync(request);
        return Ok();
    }

    [HttpPut("{groupId:long}")]
    public async Task<IActionResult> UpdateGroup(long groupId, UpdateGroupRequest request)
    {
        await _groupService.UpdateGroupAsync(groupId, request);
        return NoContent();
    }

    [HttpPost("{groupId:long}/members")]
    public async Task<IActionResult> AddMember(long groupId, AddMemberRequest request)
    {
        await _groupService.AddMemberAsync(groupId, request);
        return NoContent();
    }

    [HttpPost("{groupId:long}/leave")]
    public async Task<IActionResult> LeaveGroup(long groupId, Guid userId)
    {
        await _groupService.LeaveGroupAsync(groupId, userId);
        return NoContent();
    }

    [HttpDelete("{groupId:long}")]
    public async Task<IActionResult> DeleteGroup(long groupId)
    {
        await _groupService.DeleteGroupAsync(groupId);
        return NoContent();
    }
}
