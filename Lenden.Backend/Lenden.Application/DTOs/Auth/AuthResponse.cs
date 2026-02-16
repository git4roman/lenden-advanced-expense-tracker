namespace Lenden.Application.DTOs;

public record AuthResponse(bool Success,string Message,string? UserId,string? Token);