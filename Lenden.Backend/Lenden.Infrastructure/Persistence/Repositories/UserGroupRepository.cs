using Lenden.Application.Interfaces.Repositories;
using Lenden.Domain.Entities;
using Lenden.Infrastructure.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Lenden.Infrastructure.Persistence.Repositories;

public class UserGroupRepository: IUserGroupRepository
{
    private readonly AppDbContext _dbContext;
    public UserGroupRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task EnsureUserInGroupAndActiveAsync( Guid groupId,Guid userId, CancellationToken ct = default)
    {
        var userGroup = await _dbContext.UserGroups.FirstOrDefaultAsync(ug => ug.Group.Slug == groupId && ug.User.Slug == userId && ug.User.Status == GroupMembershipStatus.Active);
        if(userGroup == null) throw new Exception("User not in group");
    }
}