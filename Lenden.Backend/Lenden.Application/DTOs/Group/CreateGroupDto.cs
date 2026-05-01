namespace Lenden.Application.DTOs.Group;

public record CreateGroupRequestDto(string Name, string? ImageUrl, List<RequestedUser> RequestedUsers);
public record CreateGroupResponseDto();