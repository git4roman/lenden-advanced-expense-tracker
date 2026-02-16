using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces.Repositories;

public interface IUserRepository
{
    Task<UserEntity> GetUserByIdAsync(int id);
    Task<UserEntity> GetUserByEmailAsync(string email);
    Task<UserEntity> CreateUserAsync(UserEntity user);
}