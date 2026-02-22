using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Services;
using Lenden.Domain.Entities;
using Lenden.Domain.ValueObjects;


using Lenden.Application.DTOs;
using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Services;
using Lenden.Application.Interfaces.Validators;
using Lenden.Application.Managers;
using Lenden.Application.Validatiors;
using Lenden.Domain.Entities;

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

    public async Task CreateExpenseAsync(CreateExpenseRequest request, CancellationToken ct = default)
{
    var group = await _groupService.GetGroupByPublicIdAsync(request.GroupPublicId, ct);
    if (group is null) throw new Exception("Group not found");

    var payers = request.Payers.ToList();
    var splitters = request.Splitters.ToList();
    
    var userIdByPublicId = group.UserGroups
        .ToDictionary(ug => ug.User.PublicId, ug => ug.UserId);
    
    var payerIds = payers.Select(p =>
            userIdByPublicId.TryGetValue(p.UserPublicId, out var id)
                ? id
                : throw new Exception($"Payer {p.UserPublicId} not found in group."))
        .ToList();
    
    var splitterIds = splitters.Select(s =>
            userIdByPublicId.TryGetValue(s.UserPublicId, out var id)
                ? id
                : throw new Exception($"Splitter {s.UserPublicId} not found in group."))
        .ToList();
    
    var balanceByPair = group.UserBalances
        .ToDictionary(b => (b.CreditorId, b.DebtorId));

    var allParticipantIds = request.Payers
        .Select(p => p.UserPublicId)
        .Concat(request.Splitters.Select(s => s.UserPublicId))
        .Distinct();

    foreach (var allParticipantId in allParticipantIds)
    {
        if (!group.IsActiveMember(allParticipantId))
            throw new Exception($"User {allParticipantId} is not an active member of the group.");
    }

    // Begin transaction
    await using var transaction = await _unitOfWork.BeginTransactionAsync(ct);
    try
    {
        // Create expense
        var expense = ExpenseEntity.Create(
            group.PublicId,
            request.TotalAmount,
            request.Category,
            payers,
            splitters,
            request.Description,
            request.ImageUrl
        );
        await _unitOfWork.ExpenseRepository.AddAsync(expense, ct);

        for (var i = 0; i < splitters.Count; i++)
        {
            var debtorId = splitterIds[i];
            var amount = splitters[i].Amount;

            for (var j = 0; j < payers.Count; j++)
            {
                var creditorId = payerIds[j];

                if (!balanceByPair.TryGetValue((creditorId, debtorId), out var balance))
                {
                    balance = group.CreateUserBalance(group.Id, creditorId, debtorId);
                    await _unitOfWork.UserBalanceRepository.AddAsync(balance, ct);
                    balanceByPair[(creditorId, debtorId)] = balance; // keep dict in sync
                }

                if (amount > 0) balance.UpdateBalance(amount, creditorId, debtorId);
            }
        }

        // Commit transaction
        await _unitOfWork.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);
    }
    catch
    {
        await transaction.RollbackAsync(ct);
        throw; 
    }
}
    
    public async Task UpdateExpenseAsync(UpdateExpenseRequest request, CancellationToken ct = default)
{
    var group = await _groupService.GetGroupByPublicIdAsync(request.GroupPublicId, ct)
                ?? throw new Exception("Group not found");
    var expense = group.Expenses.SingleOrDefault(e => e.PublicId == request.ExpensePublicId) ?? throw new Exception("Expense not found");

    var payers = request.Payers.ToList();
    var splitters = request.Splitters.ToList();

    var userIdByPublicId = group.UserGroups
        .ToDictionary(ug => ug.User.PublicId, ug => ug.UserId);

    var payerIds = payers.Select(p =>
            userIdByPublicId.TryGetValue(p.UserPublicId, out var id)
                ? id
                : throw new Exception($"Payer {p.UserPublicId} not found in group."))
        .ToList();

    var splitterIds = splitters.Select(s =>
            userIdByPublicId.TryGetValue(s.UserPublicId, out var id)
                ? id
                : throw new Exception($"Splitter {s.UserPublicId} not found in group."))
        .ToList();

    var balanceByPair = group.UserBalances
        .ToDictionary(b => (b.CreditorId, b.DebtorId));

    var allParticipantIds = payers.Select(p => p.UserPublicId)
        .Concat(splitters.Select(s => s.UserPublicId))
        .Distinct();

    foreach (var participantId in allParticipantIds)
    {
        if (!group.IsActiveMember(participantId))
            throw new Exception($"User {participantId} is not an active member of the group.");
    }

    await using var transaction = await _unitOfWork.BeginTransactionAsync(ct);
    try
    {
        foreach (var oldSplitter in expense.Splitters)
        {
            if (!userIdByPublicId.TryGetValue(oldSplitter.UserPublicId, out var oldDebtorId))
                continue; 

            foreach (var oldPayer in expense.Payers)
            {
                if (!userIdByPublicId.TryGetValue(oldPayer.UserPublicId, out var oldCreditorId))
                    continue;

                if (balanceByPair.TryGetValue((oldCreditorId, oldDebtorId), out var oldBalance))
                {
                    var amount = oldSplitter.Amount;
                    if (amount > 0) oldBalance.UpdateBalance(-amount, oldCreditorId, oldDebtorId);
                }
            }
        }

        // Update expense properties
        expense.Update(
            expense.PublicId,
            group.PublicId,
            totalAmount: request.TotalAmount,
            category: request.Category,
            payers: payers,
            splitters: splitters,
            description: request.Description,
            imageUrl: request.ImageUrl
        );

        // Apply new balances
        for (var i = 0; i < splitters.Count; i++)
        {
            var debtorId = splitterIds[i];
            var amount = splitters[i].Amount;

            for (var j = 0; j < payers.Count; j++)
            {
                var creditorId = payerIds[j];

                if (!balanceByPair.TryGetValue((creditorId, debtorId), out var balance))
                {
                    balance = group.CreateUserBalance(group.Id, creditorId, debtorId);
                    await _unitOfWork.UserBalanceRepository.AddAsync(balance, ct);
                    balanceByPair[(creditorId, debtorId)] = balance;
                }

                if (amount > 0) balance.UpdateBalance(amount, creditorId, debtorId);
            }
        }

        await _unitOfWork.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);
    }
    catch
    {
        await transaction.RollbackAsync(ct);
        throw;
    }
}

    public async Task<IEnumerable<ExpenseEntity?> >GetGroupExpensesAsync(Guid groupId, CancellationToken ct = default)
    {
        
        var group = await _groupService.GetGroupByPublicIdAsync(groupId, ct);

        return group?.Expenses ?? Enumerable.Empty<ExpenseEntity?>();
    }

    // public async Task DeleteExpenseAsync(Guid expenseId, CancellationToken ct = default)
    // {
    //     var expense = await _unitOfWork.ExpenseRepository
    //         .GetByPublicIdAsync(expenseId, ct);
    //
    //     if (expense is null)
    //         throw new Exception("Expense not found");
    //
    //     _unitOfWork.ExpenseRepository.Remove(expense);
    //
    //     // Optional: reverse balances here if needed
    //
    //     await _unitOfWork.SaveChangesAsync(ct);
    // }
    
    // private async Task EnsureGroupMemberByPublicIdAsync(Guid groupId, Guid userId, CancellationToken ct = default)
    // {
    //    await _unitOfWork.UserGroupRepository.EnsureUserInGroupAndActiveAsync( groupId,userId, ct);
    // }
    
}
