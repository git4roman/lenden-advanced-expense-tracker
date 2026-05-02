using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Repositories;
using Lenden.Infrastructure.Persistence.DbContexts;
using Lenden.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using IUserRepository = Lenden.Application.Interfaces.IUserRepository;

namespace Lenden.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public UnitOfWork(AppDbContext context, IUserRepository userRepository, IAuthRepository authRepository, IGroupRepository groupRepository, IUserGroupRepository userGroupRepository, IExpenseRepository expenseRepository, IFriendshipRepository friendshipRepository,ISettlementRepository settlementRepository)
    {
        _context = context;
        UserRepository = userRepository;
        AuthRepository = authRepository;
        GroupRepository = groupRepository;
        UserGroupRepository = userGroupRepository;
        ExpenseRepository = expenseRepository;
        FriendshipRepository=friendshipRepository;
        SettlementRepository = settlementRepository;
    }

    public IUserRepository UserRepository { get; private set; }
    public IAuthRepository AuthRepository { get; private set; }
    public IGroupRepository GroupRepository { get; private set; }
    public IUserGroupRepository UserGroupRepository { get; private set; }
    public IExpenseRepository ExpenseRepository { get; private set; }
    public ISettlementRepository SettlementRepository { get; private set; }
    
    public IFriendshipRepository FriendshipRepository { get; private set; }
    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken ct = default)
    {
        return await _context.Database.BeginTransactionAsync(ct);
    }
    
    public async Task ReloadEntityAsync<T>(T entity) where T : class
    {
        await _context.Entry(entity).ReloadAsync();
    }
    
    
    // Detach a single entity
    public void DetachEntity<T>(T entity) where T : class
    {
        var entry = _context.Entry(entity);
        if (entry.State != EntityState.Detached)
        {
            entry.State = EntityState.Detached;
        }
    }
    
    // Detach all entities of a specific type
    public void DetachAllEntities<T>() where T : class
    {
        var entries = _context.ChangeTracker.Entries<T>().ToList();
        foreach (var entry in entries)
        {
            entry.State = EntityState.Detached;
        }
    }
    
    // Clear the entire change tracker (detach ALL tracked entities)
    public void ClearChangeTracker()
    {
        _context.ChangeTracker.Clear();
    }
}