namespace Lenden.Domain.Entities;

public class GroupEntity
{
    protected GroupEntity() { } // EF Core

    public GroupEntity(string name, string imageUrl, long createdBy)
    {
        Name = name;
        ImageUrl = imageUrl;
        CreatedBy = createdBy;
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = DateTimeOffset.UtcNow;
        _userGroups = new List<UserGroupEntity>();
    }

    public long Id { get; private set; } // PK
    public Guid PublicId { get; private set; } = Guid.NewGuid(); // for API
    public string Name { get; private set; }
    public string ImageUrl { get; private set; }
    public long CreatedBy { get; private set; } // FK to User
    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset UpdatedAt { get; private set; }

    // Navigation property
    private readonly List<UserGroupEntity> _userGroups;
    public IReadOnlyCollection<UserGroupEntity> UserGroups => _userGroups.AsReadOnly();

    // Add user to the group
    public void AddUser(UserEntity user, UserEntity invitedBy = null)
    {
        if (_userGroups.Any(ug => ug.UserId == user.Id && ug.Status == MembershipStatus.Active))
            return; // already an active member

        var role = (_userGroups.Count == 0 || invitedBy == null) 
            ? UserGroupRole.Admin 
            : UserGroupRole.Member;

        _userGroups.Add(new UserGroupEntity(
            userId: user.Id,
            groupId: Id,
            role: role,
            invitedByUserId: invitedBy?.Id
        ));
    }


    // Optional: remove user
    public void RemoveUser(Guid userId)
    {
        // Find the active membership
        var userGroup = _userGroups
            .FirstOrDefault(ug => ug.UserId == userId && ug.Status == MembershipStatus.Active);

        if (userGroup != null)
        {
            userGroup.RemoveMember();
        }
    }

}