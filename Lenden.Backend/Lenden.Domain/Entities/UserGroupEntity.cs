using Lenden.Domain.Entities;

public class UserGroupEntity
{
    public long UserId { get; private set; }
    public UserEntity User { get; private set; }

    public long GroupId { get; private set; }  // Group PK is long
    public GroupEntity Group { get; private set; }

    public UserGroupRole Role { get; private set; }
    public GroupMembershipStatus Status { get; private set; }
    public DateTimeOffset JoinedAt { get; private set; }
    public DateTimeOffset? LeftAt { get; private set; }

    public long? InvitedByUserId { get; private set; }
    public UserEntity InvitedByUser { get; private set; }

    public UserGroupEntity(long userId, long groupId, UserGroupRole role = null, long? invitedByUserId = null)
    {
        UserId = userId;
        GroupId = groupId;
        Role = role ?? UserGroupRole.Member;
        InvitedByUserId = invitedByUserId;
        JoinedAt = DateTimeOffset.UtcNow;
        Status = GroupMembershipStatus.Active;
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
}