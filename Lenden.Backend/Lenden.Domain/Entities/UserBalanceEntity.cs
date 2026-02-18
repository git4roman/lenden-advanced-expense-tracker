namespace Lenden.Domain.Entities;

public class UserBalanceEntity
{
    public Guid Id { get; private set; }                // PK
    public Guid GroupPublicId { get; private set; }     // Group reference
    public long CreditorId { get; private set; }       // Internal DB Id of user who should receive
    public long DebtorId { get; private set; }         // Internal DB Id of user who should pay
    public decimal Balance { get; private set; }       // Positive → Creditor receives, Negative → Creditor pays
    public DateTimeOffset UpdatedAt { get; private set; }

    private UserBalanceEntity() { } // EF

    private UserBalanceEntity(Guid groupId, long userId1, long userId2)
    {
        Id = Guid.NewGuid();
        GroupPublicId = groupId;

        // Deterministic ordering by internal DB ID
        if (userId1 < userId2)
        {
            CreditorId = userId1;
            DebtorId = userId2;
        }
        else
        {
            CreditorId = userId2;
            DebtorId = userId1;
        }

        Balance = 0;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    // Factory method
    public static UserBalanceEntity Create(Guid groupId, long userId1, long userId2)
    {
        return new UserBalanceEntity(groupId, userId1, userId2);
    }

    // Update balance: Positive → Creditor should receive, Negative → Creditor should pay
    public void UpdateBalance(decimal amount)
    {
        Balance += amount;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    // Get balance from perspective of a user
    public decimal GetBalanceForUser(long userId)
    {
        if (userId == CreditorId) return Balance;
        if (userId == DebtorId) return -Balance;
        throw new ArgumentException("User not part of this balance pair.");
    }
}