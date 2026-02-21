using Lenden.Domain.ValueObjects;

namespace Lenden.Application.DTOs;

public record CreateExpenseRequest(
    decimal TotalAmount,
    Guid GroupPublicId,
    int Category,
    string? Description,
    string? ImageUrl,
    List<ExpenseParticipant> Payers,
    List<ExpenseParticipant> Splitters
);

