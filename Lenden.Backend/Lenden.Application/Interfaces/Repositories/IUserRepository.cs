using Lenden.Application.DTOs;
using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces;

public interface IUserRepository
{
    Task CreateUserAsync(UserEntity user);
    Task<UserEntity> GetUserByEmailAsync(string email, CancellationToken ct = default);
    Task<UserEntity> GetUserByPublicIdAsync(Guid userId, CancellationToken ct = default);
    Task<UserEntity> GetUserByIdAsync(long userId, CancellationToken ct = default);
    Task<UserEntity> GetUserWithInfoByIdAsync(long userId, CancellationToken ct = default);
    
    Task<List<UserIdandPublicIdDto>> GetUsersIdsInBulkWithPublicIdAsync(List<Guid> publicIds, CancellationToken ct = default);
    Task<List<UserEntity>> GetUsersInBulkWithPublicIdAsync(List<Guid> publicIds, CancellationToken ct = default);
    Task<List<UserEntity>> GetUsersInBulkWithPhoneNumberAsync(List<String> phoneNumbers, CancellationToken ct = default);
    Task UpdateUserAsync(UserEntity user);
    Task AddUsersInBulkAsync(List<UserEntity> users, CancellationToken ct = default);

}