namespace Lenden.Application.DTOs.Group;

public record AddGroupMemberRequestDto(List<RequestedUser> RequestedUsers);

public record AddGroupMembersResponseDto(string Message);