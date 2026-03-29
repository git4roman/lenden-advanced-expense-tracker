using System.Transactions;
using Lenden.Application.DTOs;
using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Services;
using Lenden.Application.Managers;
using Lenden.Domain.Entities;

namespace Lenden.Application.Services;

public class GroupService : IGroupService
{
    private readonly IUnitOfWork _unitOfWork;

    public GroupService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task CreateGroupAsync(Guid creatorId,CreateGroupRequest request, CancellationToken ct = default)
    {
        var creator = await _unitOfWork.UserRepository.GetUserByPublicIdAsync(creatorId, ct);
        if (creator is null)
            throw new Exception("Creator not found");

        var group = new GroupEntity(request.Name, request.ImageUrl, creator.Id);

        group.AddMember(group,creator,creator.Id, true);
        try
        {
            var publicIds = request.UserIds
                .Distinct()
                .ToList();

            var users = await _unitOfWork.UserRepository.GetUsersInBulkWithPublicIdAsync(publicIds, ct);
            group.AddMembersBulk(group,users,creator.Id);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
        await _unitOfWork.GroupRepository.AddAsync(group, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        // return;
    }

    public async Task UpdateGroupAsync(Guid groupId, UpdateGroupRequest request, CancellationToken ct = default)
    {
        var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId, ct);
        if (group is null)
            throw new Exception("Group not found");

        group.UpdateInfo(request.Name, request.ImageUrl);

        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task AddMemberAsync(Guid groupId, AddMemberRequestDto requestDto,long invitedByUserId, CancellationToken ct = default)
    {
      var group= await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId, ct);
      if(group is null) throw new Exception("Group not found");
        var users = await _unitOfWork.UserRepository.GetUsersInBulkWithPublicIdAsync(requestDto.UserIds, ct);
        if (users is null)
            throw new Exception("Users not found");

        group.AddMembersBulk(group,users, invitedByUserId);
        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task LeaveGroupAsync(Guid groupId, long userId, CancellationToken ct = default)
    {
        var group= await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId, ct);
        if(group is null) throw new Exception("Group not found");
        var user = await _unitOfWork.UserRepository.GetUserByIdAsync(userId, ct);
        if(user is null) throw new Exception("User not found");
        group.RemoveMember(user.Id);
        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task RemoveMemberAsync(Guid groupId, Guid memberId, long userId, CancellationToken ct = default)
    {
        var group= await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId, ct);
        if(group is null) throw new Exception("Group not found");
        var member = await _unitOfWork.UserRepository.GetUserByPublicIdAsync(memberId, ct);
        if(member is null) throw new Exception("Member not found");
        if(group.CreatedBy == userId)
        {
            group.RemoveMember(member.Id);
            await _unitOfWork.SaveChangesAsync(ct);
        }
        else throw new Exception("You are not the creator of this group");
    }

    public async Task DeleteGroupAsync(Guid groupId,long userId, CancellationToken ct = default)
    {
        var group= await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId, ct);
        if (group is null) throw new Exception("Group not found");
        if(group.CreatedBy == userId)
        {
            // _unitOfWork.GroupRepository.Remove(group);
            group.DisableGroup();
            await _unitOfWork.SaveChangesAsync(ct);
        }
        else throw new Exception("You are not the creator of this group");
        
    }

    public async Task<IEnumerable<GroupEntity>> GetAllActiveAsync(CancellationToken ct = default)
    {
        var allGroups = await _unitOfWork.GroupRepository.GetAllActiveAsync();
        return allGroups;
    }

    // public async Task<UserEntity?> GetGroupMemberByPublicId(Guid groupId, Guid userId, CancellationToken ct = default)
    // {
    //     var user = await _unitOfWork.GroupRepository.GetGroupMemberByUserPublicIdAsync(groupId,userId, ct);
    //     if (user is null)
    //         throw new KeyNotFoundException("User is not a member of the group.");
    //     return user;
    // }

    public async Task<GroupEntity?> GetGroupByPublicIdAsync(Guid groupId, CancellationToken ct = default)
    {
        var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId, ct);
        if (group is null)
            throw new Exception("Group not found.");
        return group;
    }

    public async Task<IEnumerable<GroupEntity?>> GetGroupsByUserIdAsync(Guid userId,CancellationToken ct = default)
    {
        return await _unitOfWork.GroupRepository.GetByUserPublicIdAsync(userId);
    }

    public async Task<List<Transaction>> GetBalance(Guid groupId, CancellationToken ct = default)
    {
        var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId);
        if (group is null) throw new Exception("Group not found");
        var memberships = group.Members.AsQueryable();
        
        var transactions = new List<Transaction>();

        // Split into creditors and debtors
        var creditors = memberships.Where(p => p.NetBalance > 0).OrderByDescending(p => p.NetBalance).ToList();
        var debtors = memberships.Where(p => p.NetBalance < 0).OrderBy(d => d.NetBalance).ToList();

        int i = 0, j = 0;

        while (i < debtors.Count && j < creditors.Count)
        {
            var debtor = debtors[i];
            var creditor = creditors[j];

            decimal amount = Math.Min(-debtor.NetBalance, creditor.NetBalance);

            transactions.Add(new Transaction
            {
                From = debtor.User.GivenName,
                To = creditor.User.GivenName,
                Amount = amount
            });

            debtor.UpdateNetBalance(amount);
            creditor.UpdateNetBalance(-amount);

            if (debtor.NetBalance == 0) i++;
            if (creditor.NetBalance == 0) j++;
        }

        return transactions;
        

    }
    
    public class Transaction
    {
        public string From { get; set; }
        public string To { get; set; }
        public decimal Amount { get; set; }
    }
}