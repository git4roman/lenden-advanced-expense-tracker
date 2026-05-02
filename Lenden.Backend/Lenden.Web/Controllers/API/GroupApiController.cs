using Lenden.Application.DTOs;
using Lenden.Application.DTOs.Group;
using Lenden.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lenden.Web.Controllers.API;

[Route("api/v1/groups")]
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
        var result = await _groupService.GetGroupsByUserIdAsync(currentUser.Slug,ct);
        return Ok(result);
    }

    [HttpGet("{groupId:guid}")]
    public async Task<IActionResult> GetGroup(Guid groupId, CancellationToken ct = default)
    {
        var currentUser = await _authService.ValidateUserAsync(User, ct);
        var result = _groupService.GetGroupByPublicIdAsync(groupId, ct);

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateGroup(CreateGroupRequestDto request, CancellationToken ct = default)
    {
        var currentUser = await _authService.ValidateUserAsync(User, ct);

        await _groupService.CreateGroupAsync(currentUser, request);
        return Ok(new CreateGroupResponseDto("Group created successfully"));
    }

    [HttpPut("{groupId:guid}")]
    public async Task<IActionResult> UpdateGroup(Guid groupId, UpdateGroupRequestDto requestDto,CancellationToken ct = default)
    {
        await _authService.ValidateUserAsync(User, ct);
        await _groupService.UpdateGroupAsync(groupId, requestDto);
        return Ok( new UpdateGroupResponseDto("Group updated successfully"));
    }

    [HttpPost("{groupId:guid}/members")]
    public async Task<IActionResult> AddMember(Guid groupId, AddGroupMemberRequestDto requestDto,CancellationToken ct = default)
    {
        var currentUser = await _authService.ValidateUserAsync(User, ct);
        await _groupService.AddMemberAsync(groupId, requestDto, currentUser.Id);
        return Ok(new AddGroupMembersResponseDto("Added Members successfully"));
    }

    [HttpPost("{groupId:guid}/leave")]
    public async Task<IActionResult> LeaveGroup([FromRoute]Guid groupId,CancellationToken ct = default)
    {
        var currentUser = await _authService.ValidateUserAsync(User, ct);
        await _groupService.LeaveGroupAsync(groupId, currentUser.Id);
        return NoContent();
    }

    [HttpDelete("{groupId:guid}")]
    public async Task<IActionResult> DeleteGroup([FromRoute]Guid groupId,CancellationToken ct = default)
    {
       var currenUser= await _authService.ValidateUserAsync(User, ct);
        // await _groupManager.EnsureGroupAdminAsync(groupId, User, ct);
        await _groupService.DeleteGroupAsync(groupId, currenUser.Id);
        return NoContent();
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllGroups(CancellationToken ct = default)
    {
       var currenUser= await _authService.ValidateUserAsync(User, ct);
       var allGroups = await _groupService.GetAllActiveAsync();
       return Ok(allGroups);
    }

    [HttpGet("{groupId:guid}/balance")]
    public async Task<IActionResult> GetGroupBalance([FromRoute]Guid groupId, CancellationToken ct = default)
    {
        
        var transcations = await _groupService.GetBalance(groupId, ct);
        return Ok(transcations);
    }
    
    

    
    
    
}
