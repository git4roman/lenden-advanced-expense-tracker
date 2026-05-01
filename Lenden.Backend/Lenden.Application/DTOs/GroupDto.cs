namespace Lenden.Application.DTOs;


public record LeaveGroupRequest(Guid UserId);

public record RequestedUser(string PhoneNumber,  string Email, string FullName);
