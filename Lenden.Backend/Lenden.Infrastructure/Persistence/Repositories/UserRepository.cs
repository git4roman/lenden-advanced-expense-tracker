using Lenden.Application.DTOs;
using Lenden.Application.Interfaces;
using Lenden.Domain.Entities;
using Lenden.Domain.ValueObjects;
using Lenden.Infrastructure.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Lenden.Infrastructure.Persistence.Repositories;

public class UserRepository: IUserRepository
{
    
    private readonly AppDbContext _dbContext;
    public UserRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task CreateUserAsync(UserEntity user)
    {
       await _dbContext.Users.AddAsync(user);
    }

    public async Task<UserEntity> GetUserByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.Users.Include(u=>u.Sessions).FirstOrDefaultAsync<UserEntity>(u=> u.Email  == Email.Create(email));
       return entity;
    }
    public async Task<UserEntity?> GetUserByPublicIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.Users.FirstOrDefaultAsync<UserEntity>(u=> u.PublicId == id);
        return entity;
    }

    public async Task<UserEntity> GetUserByIdAsync(long userId, CancellationToken ct = default)
    {
        var entity = await _dbContext.Users.FirstOrDefaultAsync<UserEntity>(u=> u.Id == userId);
        return entity;
    }

    public async Task<List<UserIdandPublicIdDto>> GetUsersIdsInBulkWithPublicIdAsync(List<Guid> publicIds, CancellationToken ct = default)
    {
         return await _dbContext.Users
            .Where(u => publicIds.Contains(u.PublicId))
            .Select(u => new UserIdandPublicIdDto(u.Id, u.PublicId))
            .ToListAsync();
    }
    
}