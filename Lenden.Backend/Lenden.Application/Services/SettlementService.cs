using Lenden.Application.DTOs;
using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Services;
using Lenden.Domain.Entities;
using Lenden.Web.Models.Exceptions;

namespace Lenden.Application.Services;

public class SettlementService: ISettlementService
{
    private readonly IGroupService _groupService;
    private readonly IUnitOfWork _unitOfWork;

    public SettlementService(IGroupService groupService,IUnitOfWork  unitOfWork)
    {
        _groupService = groupService;
        _unitOfWork = unitOfWork;
    }
    public async Task<MakeSettlementResponseDto> MakeSettlement(MakeSettlementRequestDto request)
    {
        var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(request.GroupId);
        if (group is null)
            throw new NotFoundException("Group does not exist");
        var transactions =  _groupService.GetBalance(group);

        var settlementTransaction = transactions
            .FirstOrDefault(t =>
                t.ToUserId == request.RequestedBy &&
                t.FromUserId == request.DebtorId);
        
        

        if (settlementTransaction is null)
            throw new NotFoundException("Settlement transaction not found");

        

        var creditor = group.Members
            .SingleOrDefault(p => p.User.Slug == request.RequestedBy);

        if (creditor is null)
            throw new NotFoundException("Creditor not found");

        var debtor = group.Members
            .SingleOrDefault(p => p.User.Slug == request.DebtorId);

        if (debtor is null)
            throw new NotFoundException("Debtor not found");

        var amount = settlementTransaction.Amount;

        
        creditor.UpdateNetBalance(-amount);
        debtor.UpdateNetBalance(amount);

        var settlementEntity = group.MakeSettlement(
            creditor.User,
            debtor.User,
            Math.Abs(amount)
        );

        settlementEntity.UpdateStatus(SettlementStatusEnums.Completed);
        
        await _unitOfWork.SaveChangesAsync();
        var response = new MakeSettlementResponseDto(
            settlementEntity.Slug,
            creditor.User.Slug,
            debtor.User.Slug,
            Math.Abs(amount)
        );

        return response;
    }

    public async Task<SettleSettlementResponseDto> SettleSettlement(SettleSettlementRequestDto request)
    {
        var settlement = await _unitOfWork.SettlementRepository.GetSettlementBySlug(request.SettlementId);
        if(settlement is null) throw new NotFoundException("Settlement not found");
        
        settlement.UpdateStatus(SettlementStatusEnums.Completed);
        await _unitOfWork.SaveChangesAsync();
        return new SettleSettlementResponseDto($"Settlement with {settlement.Slug} Id is completed");
    }

    public async Task<RequestSettlementResponseDto> RequestSettlement(RequestSettlementRequestDto request)
    {
        var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(request.GroupId);
        if(group is null) throw new NotFoundException("Group does not exist");
        var transactions=  _groupService.GetBalance(group);
        var settlementTransaction = transactions.Where(t=> (t.FromUserId == request.RequestedBy)|| (t.ToUserId== request.RequestedBy)).SingleOrDefault();
        if(settlementTransaction is null) throw new NotFoundException("Settlement transaction not found");
       
        
        var debtor = group.Members.Where(p => p.User.Slug == request.RequestedBy).SingleOrDefault();
        if(debtor is null) throw new NotFoundException("Creditor not found");
       
        var creditor = group.Members.Where(p => p.User.Slug == request.CreditorId).SingleOrDefault();
        if(creditor is null) throw new NotFoundException("Debtor not found");
       
        creditor.UpdateNetBalance(settlementTransaction.Amount);
        debtor.UpdateNetBalance(-settlementTransaction.Amount);
       
        var settlementEntity = group.MakeSettlement(creditor.User, debtor.User, settlementTransaction.Amount);
        settlementEntity.UpdateStatus(SettlementStatusEnums.Pending);
       await _unitOfWork.SaveChangesAsync();
        var response = new RequestSettlementResponseDto(settlementEntity.Slug,debtor.User.Slug, creditor.User.Slug,settlementTransaction.Amount);
        return response;
        
    }

    public async Task<List<GetSettlementsResponseDto>> GetSettlementsByUserSlug(Guid slug)
    {
        var group = await _unitOfWork.GroupRepository.GetByUserPublicIdAsync(slug);
        if (group == null || !group.Any())
            throw new NotFoundException("Group not found");
        
        var settlements = group
            .Where(g => g != null)
            .SelectMany(g => g!.Settlements)
            .ToList();
        
        var response = settlements
            .Select(s => new GetSettlementsResponseDto
            {
                SettlementId = s.Slug,
                GroupId = s.Group.Slug,
                CreditorId = s.Creditor.Slug,
                DebtorId = s.Debtor.Slug,
                Amount = s.Amount,
                Status = s.Status.Name,
                CreatedAt = s.CreatedAt
            })
            .ToList();
        return response;
    }
}