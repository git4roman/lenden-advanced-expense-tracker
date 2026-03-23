using Lenden.Application.DTOs;
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
        var groups = await _groupService.GetGroupsByUserIdAsync(currentUser.Slug,ct);
        var result = groups.Select(g => new GroupDto
        {
            Id = g.Slug,
            Name = g.Name,
            ImageUrl = g.ImageUrl,
            Members = g.Members.Select(m => new MemberDto
            {
                Id = m.User.Slug,
                Email = m.User.Email.Value,
                GivenName = m.User.GivenName,
                FamilyName = m.User.FamilyName
            }).ToList()
        });

        return Ok(result);
    }

    [HttpGet("{groupId:guid}")]
    public async Task<IActionResult> GetGroup(Guid groupId, CancellationToken ct = default)
    {
        try
        {
            var currentUser = await _authService.ValidateUserAsync(User, ct);
            var group = await _groupService.GetGroupByPublicIdAsync(groupId, ct);
            if (group is null)
                return NotFound();
            var result = new GroupDto
            {
                Id = group.Slug,
                Name = group.Name,
                ImageUrl = group.ImageUrl,
                Members = group.Members.Select(m => new MemberDto
                {
                    Id = m.User.Slug,
                    Email = m.User.Email.Value,
                    GivenName = m.User.GivenName,
                    FamilyName = m.User.FamilyName
                }).ToList()
            };

            return Ok(result);
        }
        catch (Exception e)
        {
           return BadRequest(new 
           {
               status = 400,
               message = e.Message
           });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateGroup(CreateGroupRequest request, CancellationToken ct = default)
    {
        var currentUser = await _authService.ValidateUserAsync(User, ct);
        
        await _groupService.CreateGroupAsync(currentUser.Slug,request);
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

    [HttpPost("{groupId:Guid}/leave")]
    public async Task<IActionResult> LeaveGroup([FromRoute]Guid groupId,CancellationToken ct = default)
    {
        var currentUser = await _authService.ValidateUserAsync(User, ct);
        await _groupService.LeaveGroupAsync(groupId, currentUser.Id);
        return NoContent();
    }

    [HttpDelete("{groupId:Guid}")]
    public async Task<IActionResult> DeleteGroup([FromRoute]Guid groupId,CancellationToken ct = default)
    {
       var currenUser= await _authService.ValidateUserAsync(User, ct);
        // await _groupManager.EnsureGroupAdminAsync(groupId, User, ct);
        await _groupService.DeleteGroupAsync(groupId, currenUser.Id);
        return NoContent();
    }
    
    public class GroupDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public List<MemberDto> Members { get; set; }
    }

    public class MemberDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string GivenName { get; set; }
        public string FamilyName { get; set; }
    }
}
