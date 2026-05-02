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
       var transactions= await _groupService.GetBalance(request.GroupId);
       var settlementTransaction = transactions.Where(t=> (t.FromUserId == request.RequestedBy)|| (t.ToUserId== request.RequestedBy)).SingleOrDefault();
       if(settlementTransaction is null) throw new NotFoundException("Settlement transaction not found");
       
       var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(request.GroupId);
       if(group is null) throw new NotFoundException("Group does not exist");
       
       var creditor = group.Members.Where(p => p.User.Slug == request.RequestedBy).SingleOrDefault();
       if(creditor is null) throw new NotFoundException("Creditor not found");
       
       var debtor = group.Members.Where(p => p.User.Slug == request.DebtorId).SingleOrDefault();
       if(debtor is null) throw new NotFoundException("Debtor not found");
       
       creditor.UpdateNetBalance(settlementTransaction.Amount);
       debtor.UpdateNetBalance(-settlementTransaction.Amount);
       
       var settlementEntity = group.MakeSettlement(creditor.User, debtor.User, settlementTransaction.Amount);
       settlementEntity.UpdateStatus(SettlementStatusEnums.Completed);
       _unitOfWork.SaveChangesAsync();
       var response = new MakeSettlementResponseDto(settlementEntity.Slug,creditor.User.Slug, debtor.User.Slug,settlementTransaction.Amount);
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
        var transactions= await _groupService.GetBalance(request.GroupId);
        var settlementTransaction = transactions.Where(t=> (t.FromUserId == request.RequestedBy)|| (t.ToUserId== request.RequestedBy)).SingleOrDefault();
        if(settlementTransaction is null) throw new NotFoundException("Settlement transaction not found");
       
        var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(request.GroupId);
        if(group is null) throw new NotFoundException("Group does not exist");
        var debtor = group.Members.Where(p => p.User.Slug == request.RequestedBy).SingleOrDefault();
        if(debtor is null) throw new NotFoundException("Creditor not found");
       
        var creditor = group.Members.Where(p => p.User.Slug == request.CreditorId).SingleOrDefault();
        if(creditor is null) throw new NotFoundException("Debtor not found");
       
        creditor.UpdateNetBalance(settlementTransaction.Amount);
        debtor.UpdateNetBalance(-settlementTransaction.Amount);
       
        var settlementEntity = group.MakeSettlement(creditor.User, debtor.User, settlementTransaction.Amount);
        settlementEntity.UpdateStatus(SettlementStatusEnums.Pending);
        _unitOfWork.SaveChangesAsync();
        var response = new RequestSettlementResponseDto(settlementEntity.Slug,debtor.User.Slug, creditor.User.Slug,settlementTransaction.Amount);
        return response;
        
    }
    
    
}