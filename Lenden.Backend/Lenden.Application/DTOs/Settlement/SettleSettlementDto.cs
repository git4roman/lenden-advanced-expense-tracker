namespace Lenden.Application.DTOs;

public class SettleSettlementRequestDto
{
    public Guid SettlementId { get; set; }
}

public class SettleSettlementResponseDto(string Message);