using Lenden.Application.DTOs;
using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Services;
using Lenden.Infrastructure.Persistence.DbContexts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lenden.Web.Controllers.API;
[Route("api/v1/settlements")]
[ApiController]
[Authorize]
public class SettlementApiController: ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IAuthService _authService;
    private readonly ISettlementService _settlementService;
    public SettlementApiController(IUnitOfWork unitOfWork, IAuthService authorizationService, ISettlementService settlementService)
    {
        _unitOfWork = unitOfWork;
        _authService = authorizationService;
        _settlementService = settlementService;
    }

    [HttpPost("{groupId:Guid}/settle")]
    public async Task<IActionResult> MakeSettlement(Guid groupId,MakeSettlementRequestDto request,CancellationToken ct=default)
    {
        var currentUser = await _authService.ValidateUserAsync(User, ct);
        var result = await _settlementService.MakeSettlement(request);
        return Ok(result);
    }

    [HttpPost("{groupId:Guid}/request")]
    public async Task<IActionResult> RequestSettlement(Guid groupId, RequestSettlementRequestDto request, CancellationToken ct=default)
    {
        var currentUser = await _authService.ValidateUserAsync(User, ct);
        var result = await _settlementService.RequestSettlement(request);
        return Ok(result);
    }

    [HttpPost("{groupId:Guid}/confirm")]
    public async Task<IActionResult> ConfirmSettlement(Guid groupId, SettleSettlementRequestDto request,
        CancellationToken ct = default)
    {   
        var currentUser = await _authService.ValidateUserAsync(User, ct);
        var result = await _settlementService.SettleSettlement(request);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetSettlements(CancellationToken ct = default)
    {
        var currentUser = await _authService.ValidateUserAsync(User, ct);
        var response = _settlementService.GetSettlementsByUserSlug(currentUser.Slug);
        return Ok(response);
    }


}