using Lenden.Application.DTOs;

namespace Lenden.Application.Interfaces.Services;

public interface IAuthService
{
   Task<AuthResponse> LoginAsync(LoginRequestDto dto);
   Task RegisterAsync(RegisterRequestDto dto);
}