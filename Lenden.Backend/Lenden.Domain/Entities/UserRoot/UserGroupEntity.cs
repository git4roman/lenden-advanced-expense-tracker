using Lenden.Domain.Entities;

public class UserGroupEntity
{
    private UserGroupEntity()
    {
        
    }
    public long UserId { get; private set; }
    public UserEntity User { get; private set; }

    public long GroupId { get; private set; } 
    public GroupEntity Group { get; private set; }

    public UserGroupRole Role { get; private set; }
    public decimal NetBalance { get; private set; } 
    public GroupMembershipStatus Status { get; private set; }
    public DateTimeOffset JoinedAt { get; private set; }
    public DateTimeOffset? LeftAt { get; private set; }

    public long? InvitedByUserId { get; private set; }
    public UserEntity InvitedByUser { get; private set; }

    public UserGroupEntity(UserEntity user, GroupEntity group, UserGroupRole? role , long? invitedByUserId = null)
    {
        User = user;
        Group = group;
        Role = role ?? UserGroupRole.Member;
        InvitedByUserId = invitedByUserId;
        JoinedAt = DateTimeOffset.UtcNow;
        Status = GroupMembershipStatus.Active;
        NetBalance = 0;
    }

    public void PromoteToAdmin() => Role = UserGroupRole.Admin;
    public void DemoteToMember() => Role = UserGroupRole.Member;
    
    

    public void RemoveMember()
    {
        Status = GroupMembershipStatus.Disabled;
        LeftAt = DateTimeOffset.UtcNow;
    }

    public void BanMember()
    {
        Status = GroupMembershipStatus.Banned;
        LeftAt = DateTimeOffset.UtcNow;
    }
    
    public void UpdateNetBalance(decimal amount)
    {
        NetBalance = NetBalance + amount;
    }
}