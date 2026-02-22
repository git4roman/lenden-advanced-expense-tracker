using Lenden.Domain.ValueObjects;

namespace Lenden.Domain.Entities;

public class ExpenseEntity
{
    public Guid Id { get; private set; }
    public Guid PublicId { get; private set; }

    public Guid GroupPublicId { get; private set; }

    public decimal TotalAmount { get; private set; }

    public ExpenseCategory Category { get; private set; } = null!;

    public string? Description { get; private set; }

    public string? ImageUrl { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    private readonly List<ExpenseParticipantEntity> _participants = new();
    public IReadOnlyCollection<ExpenseParticipantEntity> Participants => _participants.AsReadOnly();

    // Filtered views by type
    public IReadOnlyCollection<ExpenseParticipantEntity> Payers =>
        _participants.Where(p => p.Type == ExpenseParticipantType.Payer).ToList().AsReadOnly();

    public IReadOnlyCollection<ExpenseParticipantEntity> Splitters =>
        _participants.Where(p => p.Type == ExpenseParticipantType.Splitter).ToList().AsReadOnly();

    private ExpenseEntity() { } // EF

    private ExpenseEntity(
        Guid groupPublicId,
        decimal totalAmount,
        ExpenseCategory category,
        List<ExpenseParticipantEntity> payers,
        List<ExpenseParticipantEntity> splitters,
        string? description,
        string? imageUrl)
    {
        if (totalAmount <= 0)
            throw new ArgumentException("Total amount must be greater than zero.");

        if (!payers.Any())
            throw new ArgumentException("At least one payer required.");

        if (!splitters.Any())
            throw new ArgumentException("At least one splitter required.");

        PublicId = Guid.NewGuid();
        GroupPublicId = groupPublicId;
        TotalAmount = totalAmount;
        Category= category;
        Description = description;
        ImageUrl = imageUrl;
        CreatedAt = DateTimeOffset.UtcNow;

        _participants = payers
            .Select(p =>
                new ExpenseParticipantEntity(PublicId, p.GroupId, p.UserInternalId, p.Amount,
                    ExpenseParticipantType.Payer)).Concat(splitters.Select(s =>
                new ExpenseParticipantEntity(PublicId, s.GroupId, s.UserInternalId, s.Amount,
                    ExpenseParticipantType.Splitter))).ToList();

        ValidateTotals();
    }

    public static ExpenseEntity Create(
        Guid groupPublicId,
        decimal totalAmount,
        int category,
        List<ExpenseParticipantEntity> payers,
        List<ExpenseParticipantEntity> splitters,
        string? description,
        string? imageUrl)
    {
        return new ExpenseEntity(
            groupPublicId,
            totalAmount,
            ExpenseCategory.FromValue(category),
            payers,
            splitters,
            description,
            imageUrl);
    }
    
    public ExpenseEntity Update(
        Guid expenseId,
        Guid groupPublicId,
        decimal totalAmount,
        int category,
        List<ExpenseParticipantEntity> payers,
        List<ExpenseParticipantEntity> splitters,
        string? description,
        string? imageUrl)
    {
        return new ExpenseEntity(
            groupPublicId,
            totalAmount,
            ExpenseCategory.FromValue(category),
            payers,
            splitters,
            description,
            imageUrl);
    }

    private void ValidateTotals()
    {
        if (Payers.Sum(x => x.Amount) != TotalAmount)
            throw new ArgumentException("Payer total mismatch.");

        if (Splitters.Sum(x => x.Amount) != TotalAmount)
            throw new ArgumentException("Split total mismatch.");
    }
    
}
