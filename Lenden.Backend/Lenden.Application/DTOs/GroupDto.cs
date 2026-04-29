namespace Lenden.Application.DTOs;

public record CreateGroupRequest(string Name, string? ImageUrl, List<RequestedUser> RequestedUsers);
public record UpdateGroupRequest(string Name, string? ImageUrl);
public record AddMemberRequestDto(List<Guid> UserIds);
public record LeaveGroupRequest(Guid UserId);

public record RequestedUser(string PhoneNumber,  string Email, string FullName);
