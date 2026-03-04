namespace Lenden.Application.DTOs;

public record AuthResponseDto(string AccessToken, string RefreshToken);

public record AuthRequest(string deviceInfo, string ipAddress);
