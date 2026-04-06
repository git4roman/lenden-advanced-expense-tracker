using Lenden.Domain.Entities;

namespace Lenden.Application.DTOs;

public record RefreshTokenRequest(UserEntity User,string RefreshToken, string DeviceInfo, string IpAddress);

public record RefreshTokenResponse(string AccessToken, string RefreshToken);
