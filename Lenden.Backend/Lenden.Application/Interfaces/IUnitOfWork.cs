using Lenden.Application.Interfaces.Repositories;

namespace Lenden.Application.Interfaces;

public interface IUnitOfWork
{
    IUserRepository UserRepository { get; }
    IAuthRepository AuthRepository { get; }
    IGroupRepository GroupRepository { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default); 
}