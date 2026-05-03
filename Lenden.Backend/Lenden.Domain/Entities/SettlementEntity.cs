using System.Data;
using System.Text.RegularExpressions;

namespace Lenden.Domain.Entities;

public class SettlementEntity
{
    public long Id { get; private set; }
    public Guid Slug { get; private set; }
    public long GroupId { get; private set; }
    public long CreditorId { get; set; }
    public long DebtorId { get; set; }
    public decimal Amount { get; set; }
    
    public virtual GroupEntity Group { get; private set; }
    public virtual UserEntity Creditor { get; private set; }
    public virtual UserEntity Debtor { get; private set; }
    
    public SettlementStatusEnums Status { get; private set; }
    
    public DateTimeOffset CreatedAt { get; private set; }
    

    private SettlementEntity()
    {
        
    }

    private SettlementEntity(GroupEntity group, UserEntity creditor, UserEntity debtor, decimal amount)
    {
        Slug= Guid.NewGuid();
        Group = group;
        Creditor = creditor;
        Debtor = debtor;
        Amount = amount;
        CreatedAt = DateTimeOffset.UtcNow;
    }

    internal static SettlementEntity MakeSettlement(GroupEntity group, UserEntity creditor, UserEntity debtor, decimal amount)
    {
        var settlementEntity = new SettlementEntity(group, creditor, debtor, amount);
        return settlementEntity;
    }

    public void UpdateStatus(SettlementStatusEnums status)
    {
        Status = status;
    }
    
    
    
    
}