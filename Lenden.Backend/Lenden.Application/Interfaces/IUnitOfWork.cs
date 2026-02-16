using Lenden.Application.Interfaces.Repositories;

namespace Lenden.Application.Interfaces;

public interface IUnitOfWork
{
    IUserRepository UserRepository { get; }
    IAuthRepository AuthRepository { get; }
    Task<int> SaveChangesAsync(); 
}