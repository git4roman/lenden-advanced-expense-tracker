namespace Lenden.Domain.Entities;

public class ExpenseParticipantEntity
{
    public Guid Id { get; private set; }
    public Guid ExpenseId { get; private set; }         
    public long UserId { get; private set; }    
    public UserEntity User {get; private set;}
    public decimal Net { get; private set; }        
    public decimal Paid { get; private set; }        
    public decimal Split { get; private set; }     

    private ExpenseParticipantEntity() { }

    private ExpenseParticipantEntity(
        Guid expenseId,
        long userInternalId,
        decimal paid,
        decimal split,
        decimal net
        )
    {
        ExpenseId = expenseId;
        UserId = userInternalId;
        Paid = paid;
        Split = split;
        Net = net;
    }
    
    internal static ExpenseParticipantEntity CreateExpenseParticipant(
        Guid expenseId,
        long userInternalId,
        decimal paid,
        decimal split
       
        )
    {
        var net = paid - split;
        return new ExpenseParticipantEntity(expenseId, userInternalId, paid, split, net);
    }
}