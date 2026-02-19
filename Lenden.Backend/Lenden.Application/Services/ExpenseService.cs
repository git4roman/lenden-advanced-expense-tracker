using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Services;
using Lenden.Domain.Entities;
using Lenden.Domain.ValueObjects;


using Lenden.Application.DTOs;
using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Services;
using Lenden.Application.Managers;
using Lenden.Domain.Entities;

namespace Lenden.Application.Services;

public class ExpenseService : IExpenseService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IGroupService _groupService;

    public ExpenseService(IUnitOfWork unitOfWork, IGroupService groupService)
    {
        _unitOfWork = unitOfWork;
        _groupService = groupService;
    }

    public async Task CreateExpenseAsync(Guid groupId, CreateExpenseRequest request, CancellationToken ct = default)
    {
        var payers = request.Payers.ToList();
        var splitters = request.Splitters.ToList();
        
        var allParticipantIds = request.Payers
            .Select(p => p.UserPublicId)
            .Concat(request.Splitters.Select(s => s.UserPublicId))
            .Distinct();

        foreach (var allParticipantId in allParticipantIds)
        {
            await _groupService.GetGroupMemberByPublicId(groupId, allParticipantId, ct); // throws if not found (404)
        }

        var expense = ExpenseEntity.Create(
            groupId,
            request.TotalAmount,
            request.Category,
            payers,
            splitters,
            request.Description,
            request.ImageUrl);

        await _unitOfWork.ExpenseRepository.AddAsync(expense, ct);

        // 🔥 Update UserBalances
        foreach (var splitter in splitters)
        {
            foreach (var payer in payers)
            {
                if (splitter.UserPublicId == payer.UserInternalId)
                    continue;

                var balance = await _unitOfWork.UserBalanceRepository
                    .GetByUsersAsync(groupId, splitter.UserPublicId, payer.UserPublicId, ct);

                if (balance is null)
                {
                    balance = UserBalance.Create(groupId, splitter.UserInternalId, payer.UserInternalId);
                    await _unitOfWork.UserBalanceRepository.AddAsync(balance, ct);
                }

                // splitter owes payer → payer receives
                var amount = splitter.Amount;
                if (payer.UserInternalId < splitter.UserInternalId)
                    balance.UpdateBalance(amount);
                else
                    balance.UpdateBalance(-amount);
            }
        }

        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task<IEnumerable<ExpenseDto>> GetGroupExpensesAsync(Guid groupId, CancellationToken ct = default)
    {
        var expenses = await _unitOfWork.ExpenseRepository
            .GetByGroupIdAsync(groupId, ct);

        return expenses.Select(e => new ExpenseDto
        {
            PublicId = e.PublicId,
            TotalAmount = e.TotalAmount,
            Description = e.Description,
            CreatedAt = e.CreatedAt
        });
    }

    public async Task DeleteExpenseAsync(Guid expenseId, CancellationToken ct = default)
    {
        var expense = await _unitOfWork.ExpenseRepository
            .GetByPublicIdAsync(expenseId, ct);

        if (expense is null)
            throw new Exception("Expense not found");

        _unitOfWork.ExpenseRepository.Remove(expense);

        // Optional: reverse balances here if needed

        await _unitOfWork.SaveChangesAsync(ct);
    }
}
