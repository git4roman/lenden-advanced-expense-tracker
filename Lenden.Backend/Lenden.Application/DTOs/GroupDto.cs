namespace Lenden.Application.DTOs;

public record CreateGroupRequest(string Name, string? ImageUrl);
public record UpdateGroupRequest(string Name, string? ImageUrl);
public record AddMemberRequestDto(Guid UserId);
public record LeaveGroupRequest(Guid UserId);
