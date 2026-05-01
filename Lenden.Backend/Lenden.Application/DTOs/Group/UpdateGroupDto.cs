namespace Lenden.Application.DTOs.Group;

public record UpdateGroupRequestDto(string Name, string? ImageUrl);

public record UpdateGroupResponseDto(string Message);