using Lenden.Domain.ValueObjects;

namespace Lenden.Application.DTOs;

public record CreateExpenseRequest(
    decimal TotalAmount,
    Guid GroupPublicId,
    int Category,
    string? Description,
    string? Receipt,
    List<ExpenseParticipantDto> Users
);

public record DeleteExpenseRequest(Guid GroupPublicId,Guid ExpensePublicId);

public record UpdateExpenseRequest(
    Guid ExpensePublicId,
    Guid GroupPublicId,
    decimal TotalAmount,
    int Category,
    string? Description,
    string? ImageUrl,
    List<ExpenseParticipantDto> Users
);

