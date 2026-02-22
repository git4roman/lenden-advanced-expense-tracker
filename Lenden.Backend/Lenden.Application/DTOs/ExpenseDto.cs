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

public record UpdateExpenseRequest(
    Guid ExpensePublicId,
    Guid GroupPublicId,
    decimal TotalAmount,
    int Category,
    string? Description,
    string? ImageUrl,
    List<ExpenseParticipant> Payers,
    List<ExpenseParticipant> Splitters
);

