namespace Lenden.Domain.Entities;

public class ExpenseParticipantEntity
{
    public long UserInternalId { get; private set; }
    public decimal Amount { get; private set; }
    public ExpenseParticipantType Type { get; private set; }

    private ExpenseParticipantEntity() { }

    public ExpenseParticipantEntity(long userId, decimal amount, ExpenseParticipantType type)
    {
        if (amount <= 0)
            throw new ArgumentException("Amount must be greater than zero");

        UserInternalId = userId;
        Amount = amount;
        Type = type;
    }
}