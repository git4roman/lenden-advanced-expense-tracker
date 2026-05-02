namespace Lenden.Application.DTOs;

public record AuthResponseDto(string AccessToken, string RefreshToken, DateTime expiresAt);

public record AuthRequest(string deviceInfo, string ipAddress);
