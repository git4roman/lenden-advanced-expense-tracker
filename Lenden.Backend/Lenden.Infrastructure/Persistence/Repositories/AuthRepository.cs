using Lenden.Application.Interfaces.Repositories;
using Lenden.Domain.Entities;
using Lenden.Infrastructure.Persistence.DbContexts;

namespace Lenden.Infrastructure.Persistence.Repositories;

public class AuthRepository:IAuthRepository
{
    private readonly AppDbContext _dbContext;

    public AuthRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task AddSessionAsync(AuthSessionEntity userSession)
    {
        await _dbContext.AuthSessions.AddAsync(userSession);
    }

    public async Task<AuthSessionEntity> GetActiveSessionByRefreshTokenHashAsync(string refreshTokenHash)
    {
        throw new NotImplementedException();
    }
}