using Lenden.Domain.ValueObjects;

namespace Lenden.Domain.Entities;

public class ExpenseEntity
{
    public Guid Id { get; private set; }
    public Guid PublicId { get; private set; }

    public long GroupId { get; private set; }
    public GroupEntity Group { get; private set; } 
    public long CreatorId { get; private set; }
    public UserEntity Creator { get; private set; }
    public decimal TotalAmount { get; private set; }

    public ExpenseCategory Category { get; private set; } = null!;

    public string? Description { get; private set; }

    public string? ImageUrl { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    private readonly List<ExpenseParticipantEntity> _participants = new();
    public IReadOnlyCollection<ExpenseParticipantEntity> Participants => _participants.AsReadOnly();
    private ExpenseEntity() { } 

    private ExpenseEntity(
        long creatorId,
        long groupId,
        decimal totalAmount,
        ExpenseCategory category,
        string? description,
        string? imageUrl)
    {
        if (totalAmount <= 0)
            throw new ArgumentException("Total amount must be greater than zero.");
        Id = Guid.NewGuid();
        PublicId = Guid.NewGuid();
        GroupId = groupId;
        TotalAmount = totalAmount;
        Category= category;
        Description = description;
        ImageUrl = imageUrl;
        CreatedAt = DateTimeOffset.UtcNow;
    }

    public static ExpenseEntity Create(
        long creatorId,
        long groupId,
        decimal totalAmount,
        int category,
        string? description,
        string? imageUrl)
    {
        return new ExpenseEntity(
            creatorId,
            groupId,
            totalAmount,
            ExpenseCategory.FromValue(category),
            description,
            imageUrl);
    }

    public ExpenseParticipantEntity  AddExpenseParticipant(long userId, decimal paid, decimal split)
    {
        var participant = ExpenseParticipantEntity.CreateExpenseParticipant(Id,userId, paid, split);
        _participants.Add(participant);
        return participant;
    }
    
}
