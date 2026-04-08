using System.Security.Claims;
using Lenden.Application.DTOs;
using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces.Services;

public interface IAuthService
{
   Task<AuthResponseDto> LoginAsync(LoginRequestDto dto);
   Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto);
   Task<AuthResponseDto?> RefreshTokenAsync(UserEntity user,RefreshTokenRequest request);
   Task<UserEntity> ValidateUserAsync(ClaimsPrincipal userClaims, CancellationToken ct = default);

   Task ResetPassword(UserEntity user, ChangePasswordRequest request);
   Task ForgetPassword(ForgetPasswordRequest request);
   Task<AuthResponseDto?> GoogleHandlerAsync(GoogleLoginRequestDto request);


}