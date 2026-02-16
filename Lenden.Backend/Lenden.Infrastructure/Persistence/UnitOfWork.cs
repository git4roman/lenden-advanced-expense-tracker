using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Repositories;
using Lenden.Infrastructure.Persistence.DbContexts;
using IUserRepository = Lenden.Application.Interfaces.IUserRepository;

namespace Lenden.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public UnitOfWork(AppDbContext context, IUserRepository userRepository, IAuthRepository authRepository)
    {
        _context = context;
        UserRepository = userRepository;
        AuthRepository = authRepository;
    }

    public IUserRepository UserRepository { get; private set; }
    public IAuthRepository AuthRepository { get; private set; }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}