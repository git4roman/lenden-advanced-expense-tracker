namespace Lenden.Application.DTOs;

public record CreateGroupRequest(string Name, string? ImageUrl, Guid CreatorUserId);
public record UpdateGroupRequest(string Name, string? ImageUrl);
public record AddMemberRequest(Guid UserId, Guid InvitedByUserId);
public record LeaveGroupRequest(Guid UserId);
