namespace Lenden.Application.DTOs;

public class MakeSettlementRequestDto
{
    public Guid GroupId { get; set; }
    public Guid RequestedBy { get; set; }
    public Guid DebtorId {get; set;}
}

public record MakeSettlementResponseDto(
    Guid SettlementId,
    Guid RequestedBy,
    Guid DebtorId,
    decimal Amount
);