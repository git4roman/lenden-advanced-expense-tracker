namespace Lenden.Application.DTOs;


public record UpdateGroupRequest(string Name, string? ImageUrl);
public record AddMemberRequestDto(List<RequestedUser> RequestedUsers);
public record LeaveGroupRequest(Guid UserId);

public record RequestedUser(string PhoneNumber,  string Email, string FullName);
