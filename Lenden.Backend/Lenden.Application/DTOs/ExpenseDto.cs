namespace Lenden.Application.DTOs;

public record CreateExpenseRequest(
    decimal TotalAmount,
    int Category,
    string? Description,
    string? ImageUrl,
    List<ExpenseParticipantRequest> Payers,
    List<ExpenseParticipantRequest> Splitters
);

public record ExpenseParticipantRequest(
    Guid UserId,
    decimal Amount
);