using Lenden.Application.Services;
using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces.Services;

public interface IUserService
{
    Task<UserService.UserResponseDto> GetUserByIdAsync(long userId);
    Task<UserEntity> GetUserByEmailAsync(string email);
    Task<decimal> GetOverallBalance(long userId);
}