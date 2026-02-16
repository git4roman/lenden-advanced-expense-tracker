namespace Lenden.Application.DTOs;

public record RefreshTokenRequest(string RefreshToken, string DeviceInfo, string IpAddress);

public record RefreshTokenResponse(string AccessToken, string RefreshToken);
