using Lenden.Application.Interfaces.Repositories;
using Lenden.Domain.Entities;
using Lenden.Infrastructure.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Lenden.Infrastructure.Persistence.Repositories;

public class SettlementRepository: ISettlementRepository
{
    private readonly AppDbContext _dbContext;
    public SettlementRepository(AppDbContext context)
    {
     _dbContext = context;   
    }

    public async Task<SettlementEntity?> GetSettlementBySlug(Guid settlementId)
    {
        var settlement =await _dbContext.Settlements.FirstOrDefaultAsync(s=>s.Slug==settlementId);
        return settlement;
    }
}