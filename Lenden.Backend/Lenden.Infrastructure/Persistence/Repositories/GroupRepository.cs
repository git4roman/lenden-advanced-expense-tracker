using Lenden.Application.Interfaces.Repositories;
using Lenden.Domain.Entities;
using Lenden.Infrastructure.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Lenden.Infrastructure.Persistence.Repositories;

public class GroupRepository : IGroupRepository
{
    private readonly AppDbContext _context;

    public GroupRepository(AppDbContext context)
    {
        _context = context;
    }
    public async Task AddAsync(GroupEntity group, CancellationToken ct = default)
    {
        await _context.Groups.AddAsync(group, ct);
    }

    public async Task<GroupEntity?> GetByIdAsync(long id, CancellationToken ct = default)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<GroupEntity?>> GetByUserPublicIdAsync(Guid publicId, CancellationToken ct = default)
    {
        var groups = await _context.Groups
            .Where(g => g.Status == GroupStatus.Active)
            .Where(g => g.Members.Any(m =>
                m.User.Slug == publicId &&
                m.Status == GroupMembershipStatus.Active))
            .Include(g => g.Members.Where(m => m.Status == GroupMembershipStatus.Active))
            .ThenInclude(m => m.User).ThenInclude(u=>u.UserInfo)
            .ToListAsync(ct);
        return groups;
    }
    
    public async Task<IEnumerable<GroupEntity>> GetAllActiveAsync(CancellationToken ct = default)
    {
        return await _context.Groups
            .Where(g => g.Status == GroupStatus.Active)
            .Include(g => g.Members)
            .ThenInclude(m => m.User).Include(g=>g.Settlements)
            .ToListAsync(ct);
    }

    public async Task<GroupEntity?> GetByPublicIdAsync(Guid publicId, CancellationToken ct = default)
    {
        var group= await _context.Groups.Where(g=>g.Status==GroupStatus.Active).Include(g=>g.Members.Where(m => m.Status == GroupMembershipStatus.Active)).ThenInclude(u=>u.User)
            .FirstOrDefaultAsync(g => g.Slug == publicId, ct);
        return group;
    }
    public async Task<bool> ExistsAsync(long id, CancellationToken ct = default)
    {
        return await _context.Groups.Include(g=>g.Members).Where(g=>g.Status==GroupStatus.Active).AnyAsync(g => g.Id == id, ct);
    }
    public void Remove(GroupEntity group)
    {
        _context.Groups.Remove(group);
    }
    public async Task<GroupEntity?> GetGroupByUserPublicIdAsync(Guid groupId, Guid userId, CancellationToken ct = default)
    {
        var group = await _context.Groups.Where(g=>g.Status==GroupStatus.Active).FirstOrDefaultAsync(u => u.Slug == groupId, ct);
        return group;
    }

    public async Task<List<UserGroupEntity>> GetMembershipsAsync(long userId, CancellationToken ct = default)
    {
        return await _context.UserGroups.Include(u=>u.Group)
            .Where(ug => ug.UserId == userId)
            .ToListAsync(ct);
    }
    
  
    
    
}