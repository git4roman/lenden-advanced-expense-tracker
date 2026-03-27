using Lenden.Application.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore.Storage;

namespace Lenden.Application.Interfaces;

public interface IUnitOfWork
{
    IUserRepository UserRepository { get; }
    IAuthRepository AuthRepository { get; }
    IGroupRepository GroupRepository { get; }
    IUserGroupRepository UserGroupRepository { get; }
    IExpenseRepository ExpenseRepository { get; }
    IFriendshipRepository FriendshipRepository { get; }
    

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default); 
    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken ct = default);
}