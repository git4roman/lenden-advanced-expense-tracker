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
        return await _context.Groups
            .Include(g => g.UserGroups) // needed for membership logic
            .FirstOrDefaultAsync(g => g.Id == id, ct);
    }public async Task<GroupEntity?> GetByPublicIdAsync(long id, CancellationToken ct = default)
    {
        return await _context.Groups
            .Include(g => g.UserGroups) // needed for membership logic
            .FirstOrDefaultAsync(g => g.Id == id, ct);
    }

    

    public async Task<GroupEntity?> GetByPublicIdAsync(Guid publicId, CancellationToken ct = default)
    {
        return await _context.Groups
            .Include(g => g.UserGroups)
            .FirstOrDefaultAsync(g => g.PublicId == publicId, ct);
    }

    public async Task<bool> ExistsAsync(long id, CancellationToken ct = default)
    {
        return await _context.Groups.AnyAsync(g => g.Id == id, ct);
    }

    public void Remove(GroupEntity group)
    {
        _context.Groups.Remove(group);
    }
}