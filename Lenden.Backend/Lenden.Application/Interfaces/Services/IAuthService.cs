using System.Security.Claims;
using Lenden.Application.DTOs;
using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces.Services;

public interface IAuthService
{
   Task<AuthResponse> LoginAsync(LoginRequestDto dto);
   Task RegisterAsync(RegisterRequestDto dto);
   Task<RefreshTokenResponse?> RefreshTokenAsync(RefreshTokenRequest request);

   Task<UserEntity> ValidateUserAsync(ClaimsPrincipal userClaims, CancellationToken ct = default);

}