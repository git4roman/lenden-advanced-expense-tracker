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
    public decimal Cost { get; private set; }

    public ExpenseCategory Category { get; private set; } = null!;

    public string? Description { get; private set; }

    public string? Receipt { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset Date { get; private set; }
    public DateTimeOffset UpdatedAt { get; private set; }

    private readonly List<ExpenseParticipantEntity> _participants = new();
    public IReadOnlyCollection<ExpenseParticipantEntity> Participants => _participants.AsReadOnly();
    private ExpenseEntity() { } 

    private ExpenseEntity(
        long creatorId,
        long groupId,
        decimal totalAmount,
        ExpenseCategory category,
        string? description,
        string? receipt
        ,
        DateTimeOffset date)
    {
        if (totalAmount <= 0)
            throw new ArgumentException("Total amount must be greater than zero.");
        Id = Guid.NewGuid();
        Slug = Guid.NewGuid();
        GroupId = groupId;
        Cost = totalAmount;
        Category= category;
        Description = description;
        Receipt = receipt;
        CreatedAt = DateTimeOffset.UtcNow;
        CreatorId = creatorId;
        Date = date;
    }

    public static ExpenseEntity Create(
        long creatorId,
        long groupId,
        decimal totalAmount,
        int category,
        string? description,
        string? receipt,
        DateTimeOffset date
        )
    {
        return new ExpenseEntity(
            creatorId,
            groupId,
            totalAmount,
            ExpenseCategory.FromValue(category),
            description,
            receipt,
            date);
    }

    public ExpenseParticipantEntity  AddExpenseParticipant(long userId, decimal paid, decimal split)
    {
        var participant = ExpenseParticipantEntity.CreateExpenseParticipant(this,userId, paid, split);
        _participants.Add(participant);
        return participant;
    }
    
    public void UpdateExpense(decimal totalAmount,int category,string? description, string? receipt)
    {
        Cost = totalAmount;
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
