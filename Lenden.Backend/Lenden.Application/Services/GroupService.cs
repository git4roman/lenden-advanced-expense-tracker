using System.Transactions;
using Lenden.Application.DTOs;
using Lenden.Application.DTOs.Group;
using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Services;
using Lenden.Application.Managers;
using Lenden.Domain.Entities;
using Lenden.Domain.ValueObjects;
using Lenden.Web.Models.Exceptions;

namespace Lenden.Application.Services;

public class GroupService : IGroupService
{
    private readonly IUnitOfWork _unitOfWork;

    public GroupService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task CreateGroupAsync(UserEntity creator, CreateGroupRequestDto request, CancellationToken ct = default)
    {
        // 1. Create group and add creator
        var group = new GroupEntity(request.Name, request.ImageUrl, creator.Id);
        group.AddMember(group, creator, creator.Id, isCreator: true);
        await _unitOfWork.GroupRepository.AddAsync(group, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        // 2. Deduplicate
        var requestedUsers = request.RequestedUsers
            .GroupBy(x => x.PhoneNumber)
            .Select(g => g.First())
            .ToList();

        var phoneNumbers = requestedUsers.Select(x => x.PhoneNumber).ToList();

        // 3. Fetch existing users
        var existingUsers = await _unitOfWork.UserRepository
            .GetUsersInBulkWithPhoneNumberAsync(phoneNumbers, ct);

        var existingPhones = existingUsers
            .Select(x => x.UserInfo.PhoneNumber)
            .ToHashSet();

        // 4. Create missing users
        var newUsers = requestedUsers
            .Where(u => !existingPhones.Contains(u.PhoneNumber))
            .Select(u =>
            {
                var (firstName, lastName) = SplitFullName(u.FullName);
                var email = string.IsNullOrWhiteSpace(u.Email)
                    ? $"missing-{u.PhoneNumber}@invalid.local"
                    : u.Email;
                var user = new UserEntity(Email.Create(email), firstName, lastName, u.PhoneNumber);
                user.UserStatusChange(UserStatus.InActive);
                return user;
            })
            .ToList();

        if (newUsers.Count > 0)
            await _unitOfWork.UserRepository.AddUsersInBulkAsync(newUsers, ct);

        // 5. Merge and add to group — single SaveChanges resolves all IDs
        var allUsers = existingUsers.Concat(newUsers).ToList();
        group.AddMembersBulk(allUsers, creator.Id);
        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task UpdateGroupAsync(Guid groupId, UpdateGroupRequestDto requestDto, CancellationToken ct = default)
    {
        var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId, ct);
        if (group is null)
            throw new NotFoundException("Group not found");

        group.UpdateInfo(requestDto.Name, requestDto.ImageUrl);

        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task AddMemberAsync(Guid groupId, AddGroupMemberRequestDto requestDto,long invitedByUserId, CancellationToken ct = default)
    {
      var group= await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId, ct);
      if(group is null) throw new Exception("Group not found");
      
      var requestedUsers = requestDto.RequestedUsers
          .GroupBy(x => x.PhoneNumber)
          .Select(g => g.First())
          .ToList();
      
        var phoneNumbers = requestedUsers.Select(x => x.PhoneNumber).ToList();
      
        var existingUsers = await _unitOfWork.UserRepository
            .GetUsersInBulkWithPhoneNumberAsync(phoneNumbers, ct);

        var existingPhones = existingUsers
            .Select(x => x.UserInfo.PhoneNumber)
            .ToHashSet();
        
        var newUsers = requestedUsers
            .Where(u => !existingPhones.Contains(u.PhoneNumber))
            .Select(u =>
            {
                var (firstName, lastName) = SplitFullName(u.FullName);
                return new UserEntity(Email.Create(u.Email), firstName, lastName, u.PhoneNumber);
            })
            .ToList();

        if (newUsers.Count > 0)
            await _unitOfWork.UserRepository.AddUsersInBulkAsync(newUsers, ct);
        
        var allUsers = existingUsers.Concat(newUsers).ToList();
        
        
        group.AddMembersBulk(allUsers, invitedByUserId);
        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task LeaveGroupAsync(Guid groupId, long userId, CancellationToken ct = default)
    {
        var group= await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId, ct);
        if(group is null) throw new NotFoundException("Group not found");
        var user = await _unitOfWork.UserRepository.GetUserByIdAsync(userId, ct);
        if(user is null) throw new NotFoundException("User not found");
        group.RemoveMember(user.Id);
        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task RemoveMemberAsync(Guid groupId, Guid memberId, long userId, CancellationToken ct = default)
    {
        var group= await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId, ct);
        if(group is null) throw new NotFoundException("Group not found");
        var member = await _unitOfWork.UserRepository.GetUserByPublicIdAsync(memberId, ct);
        if(member is null) throw new NotFoundException("Member not found");
        if(group.CreatedBy == userId)
        {
            group.RemoveMember(member.Id);
            await _unitOfWork.SaveChangesAsync(ct);
        }
        else throw new ForbiddenException("You are not the creator of this group");
    }

    public async Task DeleteGroupAsync(Guid groupId,long userId, CancellationToken ct = default)
    {
        var group= await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId, ct);
        if (group is null) throw new NotFoundException("Group not found");
        if(group.CreatedBy == userId)
        {
            // _unitOfWork.GroupRepository.Remove(group);
            group.DisableGroup();
            await _unitOfWork.SaveChangesAsync(ct);
        }
        else throw new ForbiddenException("You are not the creator of this group");
        
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

    public async Task<GroupResponseDto?> GetGroupByPublicIdAsync(Guid groupId, CancellationToken ct = default)
    {
        var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId, ct);
        if (group is null)
            throw new NotFoundException("Group not found.");
        var result = new GroupResponseDto
        {
            Id = group.Slug,
            Name = group.Name,
            ImageUrl = group.ImageUrl,
            Members = group.Members.Select(m => new GroupMemberDto
            {
                Id = m.User.Slug,
                Email = m.User.Email.Value,
                GivenName = m.User.GivenName,
                FamilyName = m.User.FamilyName,
                NetBalance = m.NetBalance,
                Avatar = m.User?.UserInfo?.ImageUrl ?? "",
            }).ToList(),
        };

        return result;
    }

    public async Task<IEnumerable<GroupsResponseDto>> GetGroupsByUserIdAsync(
        Guid userId,
        CancellationToken ct = default)
    {
        var groups = await _unitOfWork.GroupRepository.GetByUserPublicIdAsync(userId);

        var result = groups.Select(g => new GroupsResponseDto
        {
            Id = g.Slug,
            Name = g.Name,
            CoverPhoto = g.ImageUrl,

            Members = g.Members.Select(m => new GroupMembersSummary
            {
                Id = m.User.Slug,
                Email= m.User.Email.ToString(),
                GivenName = m.User.GivenName,
                FamilyName = m.User.FamilyName,
                Avatar = m.User?.UserInfo?.ImageUrl ?? "",
                RegistrationStatus = m.User.Status.Name
            }).ToList(),

            Balances = GetBalance(g, ct),
            MemberCount = g.Members.Count,
            CreatedAt = g.CreatedAt,
            UpdatedAt = g.UpdatedAt,
            InviteLink = ""
        });

        return result;
    }

    public async Task<List<GroupMembersBalanceResponseDto>> GetGroupBalance(Guid groupId, CancellationToken ct = default)
    {
        var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId);
        if (group is null) throw new Exception("Group not found");
        
        var transactions = GetBalance(group, ct);
        return transactions;
    }

    public List<GroupMembersBalanceResponseDto> GetBalance(GroupEntity group, CancellationToken ct)
    {
        // Work with a snapshot, not the real entities
        var balances = group.Members.ToDictionary(
            m => m.User.Slug,
            m => new { Member = m, Balance = m.NetBalance } // snapshot the balance
        );

        var creditors = balances.Values
            .Where(p => p.Balance > 0)
            .OrderByDescending(p => p.Balance)
            .Select(p => new { p.Member, Balance = p.Balance })
            .ToList();

        // Use mutable wrapper instead of touching the entity
        var workingBalances = balances.Values
            .Select(p => new WorkingBalance(p.Member, p.Balance))
            .ToList();

        var debtors = workingBalances.Where(p => p.Balance < 0).OrderBy(d => d.Balance).ToList();
        var creditorsList = workingBalances.Where(p => p.Balance > 0).OrderByDescending(p => p.Balance).ToList();

        var transactions = new List<GroupMembersBalanceResponseDto>();
        int i = 0, j = 0;

        while (i < debtors.Count && j < creditorsList.Count)
        {
            var debtor = debtors[i];
            var creditor = creditorsList[j];

            decimal amount = Math.Min(-debtor.Balance, creditor.Balance);

            transactions.Add(new GroupMembersBalanceResponseDto
            {
                From = debtor.Member.User.GivenName,
                FromUserId = debtor.Member.User.Slug,
                To = creditor.Member.User.GivenName,
                ToUserId = creditor.Member.User.Slug,
                Amount = amount
            });

            // Mutate the COPY, not the entity
            debtor.Balance += amount;
            creditor.Balance -= amount;

            if (debtor.Balance == 0) i++;
            if (creditor.Balance == 0) j++;
        }

        return transactions;
    }
    
    private static (string First, string Last) SplitFullName(string fullName)
    {
        var parts = fullName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        return (
            parts.FirstOrDefault() ?? string.Empty,
            parts.Length > 1 ? string.Join(" ", parts.Skip(1)) : string.Empty
        );
    }
    
    private class WorkingBalance(UserGroupEntity member, decimal balance)
    {
        public UserGroupEntity Member { get; } = member;
        public decimal Balance { get; set; } = balance;
    }


   
    
    
}