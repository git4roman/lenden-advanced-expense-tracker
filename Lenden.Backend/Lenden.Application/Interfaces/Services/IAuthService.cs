using System.Security.Claims;
using Lenden.Application.DTOs;
using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces.Services;

public interface IAuthService
{
   Task<AuthResponseDto> LoginAsync(LoginRequestDto dto);
   Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto);
   Task<RefreshTokenResponse?> RefreshTokenAsync(RefreshTokenRequest request);
   Task<UserEntity> ValidateUserAsync(ClaimsPrincipal userClaims, CancellationToken ct = default);
   

}