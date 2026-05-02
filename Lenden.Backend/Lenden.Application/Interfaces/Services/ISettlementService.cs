using Lenden.Application.DTOs;

namespace Lenden.Application.Interfaces.Services;

public interface ISettlementService
{
    Task<MakeSettlementResponseDto> MakeSettlement(MakeSettlementRequestDto request);
    Task<SettleSettlementResponseDto> SettleSettlement(SettleSettlementRequestDto request);
    Task<RequestSettlementResponseDto> RequestSettlement(RequestSettlementRequestDto request);
}