using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces.Repositories;

public interface ISettlementRepository
{
    Task<SettlementEntity?> GetSettlementBySlug(Guid settlementId);
}