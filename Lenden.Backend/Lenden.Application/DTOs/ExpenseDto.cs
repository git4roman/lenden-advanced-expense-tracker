using Lenden.Domain.ValueObjects;

namespace Lenden.Application.DTOs;

public record CreateExpenseRequest(
    decimal TotalAmount,
    int Category,
    string? Description,
    string? ImageUrl,
    List<ExpenseParticipant> Payers,
    List<ExpenseParticipant> Splitters
);

