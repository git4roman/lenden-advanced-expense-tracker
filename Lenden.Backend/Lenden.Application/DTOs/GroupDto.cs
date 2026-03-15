namespace Lenden.Application.DTOs;

public record CreateGroupRequest(string Name, string? ImageUrl, List<Guid> UserIds);
public record UpdateGroupRequest(string Name, string? ImageUrl);
public record AddMemberRequestDto(Guid UserId);
public record LeaveGroupRequest(Guid UserId);
