namespace Lenden.Application.DTOs;

public class RequestSettlementRequestDto
{
    public Guid GroupId { get; set; }
    public Guid RequestedBy { get; set; }
    public Guid CreditorId {get; set;}
}

public class RequestSettlementResponseDto(
    Guid SettlementId ,
    Guid RequestedBy ,
    Guid CreditorId ,
    decimal Amount 
);