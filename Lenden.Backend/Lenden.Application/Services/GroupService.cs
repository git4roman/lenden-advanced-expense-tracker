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
                return new UserEntity(Email.Create(u.Email), firstName, lastName, u.PhoneNumber);
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
                ImgUrl = m.User?.UserInfo?.ImageUrl ?? "",
            }).ToList()
        };

        return result;
    }

    public async Task<IEnumerable<GroupsResponseDto?>> GetGroupsByUserIdAsync(Guid userId,CancellationToken ct = default)
    {
         var groups=await _unitOfWork.GroupRepository.GetByUserPublicIdAsync(userId);
        var result = groups.Select(g => new GroupsResponseDto
        {
            Id = g.Slug,
            Name = g.Name,
            ImageUrl = g.ImageUrl,
            MemberImgUrls = g.Members.Select(m=>m.User?.UserInfo?.ImageUrl ?? "").ToList(),
            MemberCount = g.Members.Count,
            CreatedAt = g.CreatedAt
        });
        return result;
    }

    public async Task<List<TransactionResponseDto>> GetGroupBalance(Guid groupId, CancellationToken ct = default)
    {
        var group = await _unitOfWork.GroupRepository.GetByPublicIdAsync(groupId);
        if (group is null) throw new Exception("Group not found");
        
        var transactions = GetBalance(group, ct);
        return transactions;
    }

    public List<TransactionResponseDto> GetBalance(GroupEntity group, CancellationToken ct)
    {
        var memberships = group.Members.AsQueryable();
        
        var transactions = new List<TransactionResponseDto>();

        // Split into creditors and debtors
        var creditors = memberships.Where(p => p.NetBalance > 0).OrderByDescending(p => p.NetBalance).ToList();
        var debtors = memberships.Where(p => p.NetBalance < 0).OrderBy(d => d.NetBalance).ToList();

        int i = 0, j = 0;

        while (i < debtors.Count && j < creditors.Count)
        {
            var debtor = debtors[i];
            var creditor = creditors[j];

            decimal amount = Math.Min(-debtor.NetBalance, creditor.NetBalance);

            transactions.Add(new TransactionResponseDto
            {
                From = debtor.User.GivenName,
                FromUserId = debtor.User.Slug,
                To = creditor.User.GivenName,
                ToUserId = creditor.User.Slug,
                Amount = amount
            });

            debtor.UpdateNetBalance(amount);
            creditor.UpdateNetBalance(-amount);

            if (debtor.NetBalance == 0) i++;
            if (creditor.NetBalance == 0) j++;
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


   
    
    
}