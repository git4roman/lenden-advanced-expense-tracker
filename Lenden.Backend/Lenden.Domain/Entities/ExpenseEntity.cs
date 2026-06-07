using Lenden.Domain.Enums;
using Lenden.Domain.ValueObjects;

namespace Lenden.Domain.Entities;

public class ExpenseEntity
{
    public Guid Id { get; private set; }
    public Guid Slug { get; private set; }

    public long GroupId { get; private set; }
    public GroupEntity Group { get; private set; } 
    public long CreatorId { get; private set; }
    public UserEntity Creator { get; private set; }
    public decimal Amount { get; private set; }
    public ExpenseCategory Category { get; private set; } = null!;
    public CreationMethod CreationMethod { get; private set; }
    public string Description { get; private set; }
    public Receipt? Receipt { get; private set; }
    public List<Repayments> Repayments { get; private set; }
    public DateTimeOffset Date { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset UpdatedAt { get; private set; }  

    private readonly List<ExpenseParticipantEntity> _participants = new();
    public IReadOnlyCollection<ExpenseParticipantEntity> Participants => _participants.AsReadOnly();
    private ExpenseEntity() { } 

    private ExpenseEntity(
        UserEntity creator,
        GroupEntity group,
        decimal amount,
        ExpenseCategory category,
        DateTimeOffset date,
        string description,
        Receipt receipt,
        CreationMethod creationMethod,
        List<Repayments> repayments)
    {        
        Id = Guid.NewGuid();
        Slug = Guid.NewGuid();
        Group = group;
        Amount = amount;
        Category= category;
        Description = description;
        Receipt = receipt;
        CreatedAt = DateTimeOffset.UtcNow;
        Date = date;
        Creator = creator;
        CreationMethod = creationMethod;
        Repayments = repayments;
    }

    public static ExpenseEntity Create(
        UserEntity creator,
        GroupEntity group,
        decimal amount,
        int category,
        DateTimeOffset date,
        string description,
        Receipt receipt,
        int creationMethod,
        List<Repayments> repayments
        )
    {
        if (amount <= 0)
            throw new ArgumentException("Total amount must be greater than zero.");
        return new ExpenseEntity(
            creator,
            group,
            amount,
            ExpenseCategory.FromValue(category),
            date,
            description,
            receipt,
            CreationMethod.FromValue(creationMethod),
            repayments);
    }

    public ExpenseParticipantEntity  AddExpenseParticipant(long userId, decimal paid, decimal split)
    {
        var participant = ExpenseParticipantEntity.CreateExpenseParticipant(this,userId, paid, split);
        _participants.Add(participant);
        return participant;
    }
    
    public void UpdateExpense(decimal totalAmount,int category,string? description, Receipt? receipt)
    {
        Amount = totalAmount;
        Category = ExpenseCategory.FromValue(category);
        Description = description;
        Receipt = receipt;
        UpdatedAt = DateTimeOffset.UtcNow;
    }
    
    public void RemoveParticipant(ExpenseParticipantEntity participant)
    {
        _participants.Remove(participant);
        UpdatedAt= DateTimeOffset.UtcNow;
    }
    
}
