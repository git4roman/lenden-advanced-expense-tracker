namespace Lenden.Domain.ValueObjects;

public sealed class ExpenseParticipant
{
    public Guid UserPublicId { get; }
    public decimal Amount { get; }

    private ExpenseParticipant() { } // EF

    public ExpenseParticipant(Guid userPublicId, decimal amount)
    {
        if (amount < 0)
            throw new ArgumentException("Amount cannot be negative.");

        UserPublicId = userPublicId;
        Amount = amount;
    }
}