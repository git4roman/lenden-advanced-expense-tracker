using Lenden.Application.DTOs;
using Lenden.Application.DTOs.User;
using Lenden.Application.Services;
using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces.Services;

public interface IUserService
{
    Task<UserResponseDto> GetUserByIdAsync(long userId);
    Task<UserEntity> GetUserByEmailAsync(string email);
    Task<decimal> GetOverallBalance(long userId);
    Task UpdateUserProfile(UserUpdateRequestDto requestDto, Guid userId);
    Task DeactivateAccount(UserEntity user);
    Task LogoutAsync(UserEntity user);
}