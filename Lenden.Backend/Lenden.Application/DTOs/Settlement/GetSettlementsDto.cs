namespace Lenden.Application.DTOs;

public class GetSettlementsRequestDto
{
}

public class GetSettlementsResponseDto
{
    public Guid SettlementId { get; set; }
    public Guid GroupId { get; set; }
    public Guid CreditorId { get; set; }
    public Guid DebtorId { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; }
    public DateTimeOffset CreatedAt  { get; set; }
}