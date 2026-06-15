namespace Lenden.Domain.Entities;

public class ExpenseParticipantEntity
{
    public Guid ExpenseId { get; private set; }  
    public ExpenseEntity Expense { get; private set; } 
    public long UserId { get; private set; }    
    public UserEntity User {get; private set;}
    public decimal Net { get; private set; }        
    public decimal Paid { get; private set; }        
    public decimal Split { get; private set; }     

    private ExpenseParticipantEntity() { }

    private ExpenseParticipantEntity(
        ExpenseEntity expense,
        long userInternalId,
        decimal paid,
        decimal split,
        decimal net
        )
    {
        Expense = expense;
        UserId = userInternalId;
        Paid = paid;
        Split = split;
        Net = net;
    }
    
    internal static ExpenseParticipantEntity CreateExpenseParticipant(
        ExpenseEntity expense,
        long userInternalId,
        decimal paid,
        decimal split
       
        )
    {
        var net = paid - split;
        return new ExpenseParticipantEntity(expense, userInternalId, paid, split, net);
    }
    
    public void Update(decimal paid, decimal split)
    {
        Paid = paid;
        Split = split;
        Net = paid - split;
    }
}