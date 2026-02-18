
using Lenden.Domain.Entities;
namespace Lenden.Application.Interfaces.Repositories;

public interface IUserBalanceRepository
{
    Task<UserBalanceEntity?> GetByUsersAsync(
        Guid groupId,
        long userId1,
        long userId2,
        CancellationToken ct = default);

    Task<List<UserBalanceEntity>> GetByGroupAsync(
        Guid groupId,
        CancellationToken ct = default);

    Task AddAsync(UserBalanceEntity balance, CancellationToken ct = default);

    void Remove(UserBalanceEntity balance);
}
