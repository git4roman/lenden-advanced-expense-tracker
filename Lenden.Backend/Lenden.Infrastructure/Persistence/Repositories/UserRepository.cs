using Lenden.Application.Interfaces;
using Lenden.Domain.Entities;
using Lenden.Domain.ValueObject;
using Lenden.Infrastructure.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Lenden.Infrastructure.Persistence.Repositories;

public class UserRepository:IUserRepository
{
    
    private readonly AppDbContext _dbContext;
    public UserRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task CreateUserAsync(UserEntity user)
    {
       await _dbContext.Users.AddAsync(user);
       await _dbContext.SaveChangesAsync();
    }

    public async Task<UserEntity> GetUserByEmailAsync(string email)
    {
        var entity = await _dbContext.Users.FirstOrDefaultAsync<UserEntity>(u=> u.Email  == Email.Create(email));
       return entity;
    }

    public async Task AddSessionAsync(UserSessionEntity userSession)
    {
       var entity = await _dbContext.UserSessions.AddAsync(userSession);
       await _dbContext.SaveChangesAsync();
    }

    public async Task<UserSessionEntity> GetActiveSessionByRefreshTokenHashAsync(string refreshTokenHash)
    {
        throw new NotImplementedException();
    }
}