using Lenden.Domain.ValueObjects;

namespace Lenden.Domain.Entities;

public class ExpenseEntity
{
    public Guid Id { get; private set; }
    public Guid PublicId { get; private set; }

    public Guid GroupPublicId { get; private set; }

    public decimal TotalAmount { get; private set; }

    public ExpenseCategory Category { get; private set; }

    public string? Description { get; private set; }

    public string? ImageUrl { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    private readonly List<ExpenseParticipant> _payers = new();
    public IReadOnlyCollection<ExpenseParticipant> Payers => _payers.AsReadOnly();

    private readonly List<ExpenseParticipant> _splitters = new();
    public IReadOnlyCollection<ExpenseParticipant> Splitters => _splitters.AsReadOnly();

    private ExpenseEntity() { } // EF

    private ExpenseEntity(
        Guid groupPublicId,
        decimal totalAmount,
        ExpenseCategory category,
        List<ExpenseParticipant> payers,
        List<ExpenseParticipant> splitters,
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

        _payers = payers;
        _splitters = splitters;

        ValidateTotals();
    }

    public static ExpenseEntity Create(
        Guid groupPublicId,
        decimal totalAmount,
        int category,
        List<ExpenseParticipant> payers,
        List<ExpenseParticipant> splitters,
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
        if (_payers.Sum(x => x.Amount) != TotalAmount)
            throw new ArgumentException("Payer total mismatch.");

        if (_splitters.Sum(x => x.Amount) != TotalAmount)
            throw new ArgumentException("Split total mismatch.");
    }
}
