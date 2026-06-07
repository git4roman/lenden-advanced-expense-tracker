namespace Lenden.Domain.ValueObjects;

public class Repayments
{
    public Guid From { get; private set; }
    public Guid To { get; private set; }
    public decimal Amount { get; private set; }

    public Repayments(Guid from, Guid to, decimal amount)
    {
        From = from;
        To = to;
        Amount = amount;
    }
}