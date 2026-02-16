using Lenden.Application.DTOs;

namespace Lenden.Application.Interfaces.Services;

public interface IAuthService
{
   Task<string> LoginAsync(LoginRequestDto dto);
   Task RegisterAsync(RegisterRequestDto dto);
}