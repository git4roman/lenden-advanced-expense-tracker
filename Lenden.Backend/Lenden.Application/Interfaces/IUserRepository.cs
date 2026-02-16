using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces;

public interface IUserRepository
{
    Task CreateUserAsync(UserEntity user);
    Task<UserEntity> GetUserByEmailAsync(string email);
    Task AddSessionAsync(UserSessionEntity userSession);
}