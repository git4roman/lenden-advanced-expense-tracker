namespace Lenden.Domain.Entities;

public class ExpenseParticipantEntity
{
    public Guid Id { get; private set; }
    public Guid ExpenseId { get; private set; }          // Link to the expense
    public long GroupId { get; private set; }            // Link to the group
    public long UserInternalId { get; private set; }     // User reference
    public decimal Amount { get; private set; }          // Amount paid or owed
    public ExpenseParticipantType Type { get; private set; } 

    private ExpenseParticipantEntity() { }

    public ExpenseParticipantEntity(
        Guid expenseId,
        long groupId,
        long userInternalId,
        decimal amount,
        ExpenseParticipantType type)
    {
        if (amount <= 0)
            throw new ArgumentException("Amount must be greater than zero");

        Id = Guid.NewGuid();
        ExpenseId = expenseId;
        GroupId = groupId;
        UserInternalId = userInternalId;
        Amount = amount;
        Type = type;
    }
}