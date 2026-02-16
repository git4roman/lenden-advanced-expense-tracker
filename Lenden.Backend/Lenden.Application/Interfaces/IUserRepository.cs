using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces;

public interface IUserRepository
{
    Task CreateUserAsync(UserEntity user);
    Task<UserEntity> GetUserByEmailAsync(string email);
    Task<UserEntity> GetUserByIdAsync(Guid id);
    Task AddSessionAsync(UserSessionEntity userSession);
    Task<UserSessionEntity> GetActiveSessionByRefreshTokenHashAsync(string refreshTokenHash);
}