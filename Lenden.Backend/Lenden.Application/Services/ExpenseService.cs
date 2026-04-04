using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Services;
using Lenden.Domain.Entities;
using Lenden.Application.DTOs;
using Lenden.Application.Interfaces.Validators;

namespace Lenden.Application.Services;

public class ExpenseService : IExpenseService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IGroupService _groupService;
    private readonly IGroupValidators _groupValidator;

    public ExpenseService(IUnitOfWork unitOfWork, IGroupService groupService, IGroupValidators groupValidator)
    {
        _unitOfWork = unitOfWork;
        _groupService = groupService;
        _groupValidator = groupValidator;
    }

    public async Task CreateExpenseAsync(long creatorId, CreateExpenseRequest request, CancellationToken ct = default)
    {
        using var transaction = await _unitOfWork.BeginTransactionAsync(ct);
        try
        {
            var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(request.GroupPublicId, ct);
            if (group is null) throw new Exception("Group not found");
            
            decimal totalPaid = request.Users.Sum(u => u.paidAmount);
            decimal totalSplit = request.Users.Sum(u => u.splitAmount);
            if (totalPaid != request.TotalAmount || totalSplit != request.TotalAmount)
            {
                throw new Exception("Total paid or split amount does not match the total amount");
            }

            // var userBalances = group.UserBalances;
            var publicIds = request.Users
                .Select(x => x.UserId)
                .Distinct()
                .ToList();

            var users = await _unitOfWork.UserRepository.GetUsersIdsInBulkWithPublicIdAsync(publicIds, ct);
            var userMap = users.ToDictionary(x => x.PublicId, x => x.UserId);

            var expenseEntity = ExpenseEntity.Create(
                creatorId,
                group.Id,
                request.TotalAmount,
                request.Category,
                request.Description,
                request.ImageUrl
            );

            foreach (var x in request.Users)
            {
                var userId = userMap[x.UserId];
                var paidAmount = x.paidAmount;
                var splitAmount = x.splitAmount;
                expenseEntity.AddExpenseParticipant(
                    userId: userMap[x.UserId],
                    paid: paidAmount,
                    split: splitAmount
                );
                var member = group.Members.FirstOrDefault(m => m.UserId == userId);
                if (member is null) continue;
                member.UpdateNetBalance(paidAmount-splitAmount);
                
            }
            await _unitOfWork.ExpenseRepository.AddAsync(expenseEntity, ct);
            await _unitOfWork.SaveChangesAsync(ct);
            await transaction.CommitAsync();
        }
        catch (Exception e)
        {
            await transaction.RollbackAsync(ct);
            throw new Exception(e.InnerException?.Message ?? e.Message);
        }
    }

    public async Task<IEnumerable<ExpenseEntity?>> GetGroupExpensesAsync(Guid groupId, CancellationToken ct = default)
    {
        return await _unitOfWork.ExpenseRepository.GetByGroupAsync(groupId);
    }

    public async Task DeleteExpenseAsync(long userId, DeleteExpenseRequest request, CancellationToken ct = default)
    {
        var group = await _groupService.GetGroupByPublicIdAsync(request.GroupPublicId, ct);
        if (group is null) throw new Exception("Group not found");
        var expense = await _unitOfWork.ExpenseRepository.GetByPublicIdAsync(request.ExpensePublicId, ct);
        if(expense is null) throw new Exception("Expense not found");

        var groupMembers = group.Members;
        var expenseParticipants=expense.Participants;

        foreach (var expenseParticipant in expenseParticipants)
        {
            foreach (var groupMember in groupMembers)
            {
                if (expenseParticipant.UserId == groupMember.UserId)
                {
                    var expenseNetBalance = expenseParticipant.Split - expenseParticipant.Paid;
                    groupMember.UpdateNetBalance(expenseNetBalance);
                }
            }
        }
        
        await _unitOfWork.ExpenseRepository.RemoveExpenseAsync(expense.PublicId, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        

    }

    // public async Task UpdateExpense(UpdateExpenseRequest request, CancellationToken ct = default)
    // {
    //     var totalPaid  = request.Users.Sum(u => u.paidAmount);
    //     var totalSplit = request.Users.Sum(u => u.splitAmount);
    //     if (totalPaid != request.TotalAmount || totalSplit != request.TotalAmount)
    //         throw new Exception("Paid and split amounts must each equal the total amount.");
    //
    //     var group   = await _groupService.GetGroupByPublicIdAsync(request.GroupPublicId, ct)
    //                   ?? throw new Exception("Group not found.");
    //     var expense = await _unitOfWork.ExpenseRepository.GetByPublicIdAsync(request.ExpensePublicId, ct)
    //                   ?? throw new Exception("Expense not found.");
    //
    //     var publicIds = request.Users.Select(u => u.UserId).Distinct().ToList();
    //     var users     = await _unitOfWork.UserRepository.GetUsersIdsInBulkWithPublicIdAsync(publicIds, ct);
    //
    //     var userMap   = users.ToDictionary(u => u.PublicId, u => u.UserId);
    //     var memberMap = group.Members.ToDictionary(m => m.UserId, m => m);
    //
    //     foreach (var participant in expense.Participants)
    //     {
    //         if (!memberMap.TryGetValue(participant.UserId, out var member)) continue;
    //         member.UpdateNetBalance(participant.Split - participant.Paid);
    //     }
    //
    //     expense.UpdateExpense(request.TotalAmount, request.Category, request.Description, request.ImageUrl);
    //
    //     await _unitOfWork.ExpenseRepository.DeleteParticipantsAsync(expense.PublicId, ct);
    //     expense.ClearParticipants();
    //
    //     foreach (var dto in request.Users)
    //     {
    //         if (!userMap.TryGetValue(dto.UserId, out var userId))
    //             throw new Exception($"User {dto.UserId} not found.");
    //
    //         expense.AddExpenseParticipant(userId, dto.paidAmount, dto.splitAmount);
    //
    //         if (memberMap.TryGetValue(userId, out var member))
    //             member.UpdateNetBalance(dto.paidAmount - dto.splitAmount);
    //     }
    //
    //     await _unitOfWork.SaveChangesAsync(ct);
    // }
}
