namespace Lenden.Application.DTOs;

public record ExpenseParticipantDto(Guid UserId, decimal paidAmount, decimal splitAmount);