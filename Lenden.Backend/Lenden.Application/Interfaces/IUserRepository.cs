using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces;

public interface IUserRepository
{
    Task CreateUserAsync(UserEntity user);
    Task<UserEntity> GetUserByEmailAsync(string email, CancellationToken ct = default);
    Task<UserEntity> GetUserByPublicIdAsync(Guid userId, CancellationToken ct = default);
   
}