namespace Lenden.Application.DTOs;

public class RequestSettlementRequestDto
{
    public Guid GroupId { get; set; }
    public Guid RequestedBy { get; set; }
    public Guid CreditorId {get; set;}
}

public class RequestSettlementResponseDto
{
    public Guid SettlementId { get; set; }
    public Guid RequestedBy { get; set; }
    public Guid CreditorId { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; }
}