using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Repositories;
using Lenden.Infrastructure.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore.Storage;
using IUserRepository = Lenden.Application.Interfaces.IUserRepository;

namespace Lenden.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public UnitOfWork(AppDbContext context, IUserRepository userRepository, IAuthRepository authRepository, IGroupRepository groupRepository, IUserBalanceRepository userBalanceRepository, IUserGroupRepository userGroupRepository, IExpenseRepository expenseRepository)
    {
        _context = context;
        UserRepository = userRepository;
        AuthRepository = authRepository;
        GroupRepository = groupRepository;
        UserBalanceRepository = userBalanceRepository;
        UserGroupRepository = userGroupRepository;
        ExpenseRepository = expenseRepository;
    }

    public IUserRepository UserRepository { get; private set; }
    public IAuthRepository AuthRepository { get; private set; }
    public IGroupRepository GroupRepository { get; private set; }
    public IUserBalanceRepository UserBalanceRepository { get; private set; }
    public IUserGroupRepository UserGroupRepository { get; private set; }
    public IExpenseRepository ExpenseRepository { get; private set; }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken ct = default)
    {
        return await _context.Database.BeginTransactionAsync(ct);
    }
}