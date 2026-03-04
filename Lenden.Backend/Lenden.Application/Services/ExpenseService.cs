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

    public async Task CreateExpenseAsync(long creatorId,CreateExpenseRequest request, CancellationToken ct = default)
{
    var group = await _groupService.GetGroupByPublicIdAsync(request.GroupPublicId, ct);
    if (group is null) throw new Exception("Group not found");

    using var transaction = await _unitOfWork.BeginTransactionAsync(ct);
    
    try
    {
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
            expenseEntity.AddExpenseParticipant(
                userId: userMap[x.UserId],
                paid: x.paidAmount,
                split: x.splitAmount
            );
        }

        await _unitOfWork.ExpenseRepository.AddAsync(expenseEntity, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        await transaction.CommitAsync();
    }
    catch (Exception e)
    {
        await transaction.RollbackAsync(ct);
        throw;
    }
}

    public async Task<IEnumerable<ExpenseEntity?>> GetGroupExpensesAsync(Guid groupId, CancellationToken ct = default)
    {
        return await _unitOfWork.ExpenseRepository.GetByGroupAsync(groupId);
    }
}
