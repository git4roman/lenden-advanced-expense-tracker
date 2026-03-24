namespace Lenden.Domain.Entities;

public class UserBalanceEntity
{
    public Guid Id { get; private set; }                // PK
    public long GroupPublicId { get; private set; }     // Group reference
    public long UserId { get; private set; }
    
    public decimal Balance { get; private set; }       // Positive → Creditor receives, Negative → Creditor pays
    public DateTimeOffset UpdatedAt { get; private set; }

    private UserBalanceEntity() { } // EF

    private UserBalanceEntity(long groupId, long userId, decimal balance)
    {
        Id = Guid.NewGuid();
        GroupPublicId = groupId;
        UserId = userId;
        Balance = balance;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    // Factory method
    public static UserBalanceEntity Create(long groupId, long userId, decimal balance)
    {
        return new UserBalanceEntity(groupId, userId, balance);
    }
    public void UpdateBalance(decimal amount)
    {
       Balance = Balance + amount;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    
}