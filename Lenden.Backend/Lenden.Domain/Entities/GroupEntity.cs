namespace Lenden.Domain.Entities;

public class GroupEntity
{
    protected GroupEntity()
    {
    } 
    public GroupEntity(string name, string imageUrl, long createdBy)
    {
        Name = name;
        ImageUrl = imageUrl;
        CreatedBy = createdBy;
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = DateTimeOffset.UtcNow;
        _members = new List<UserGroupEntity>();
        Status = GroupStatus.Active;
    }
    public long Id { get; private set; } 
    public Guid Slug { get; private set; } = Guid.NewGuid(); 
    public string Name { get; private set; }
    public string ImageUrl { get; private set; }
    public long CreatedBy { get; private set; } 
    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset UpdatedAt { get; private set; }
    public GroupStatus Status { get; private set; }

    private readonly List<UserGroupEntity> _members; 
    public IReadOnlyCollection<UserGroupEntity> Members => _members.AsReadOnly();

    public void AddMember(GroupEntity group,UserEntity user, long invitedByUserId, bool isCreator = false)
    {
        if (_members.Any(ug => ug.UserId == user.Id && ug.Status == GroupMembershipStatus.Active))
            return; 

        var role = isCreator ? UserGroupRole.Admin : UserGroupRole.Member;
        var newMember = new UserGroupEntity(
            userId: user.Id,
            group: group,
            role: role,
            invitedByUserId
        );
        _members.Add(newMember);
    }
    
    public void AddMembersBulk(GroupEntity group,IEnumerable<UserEntity> users, long invitedByUserId)
    {
        var existingUserIds = _members
            .Where(m => m.Status == GroupMembershipStatus.Active)
            .Select(m => m.UserId)
            .ToHashSet();

        foreach (var user in users)
        {
            if (existingUserIds.Contains(user.Id))
                continue;
            
            _members.Add(new UserGroupEntity(
                userId: user.Id,
                group: group,
                role: UserGroupRole.Member,
                invitedByUserId
            ));
        }
    }

    public void RemoveMember(long userId)
    {
        var userGroup = _members
            .FirstOrDefault(ug => ug.UserId == userId && ug.Status == GroupMembershipStatus.Active);

        if (userGroup != null)
        {
            userGroup.RemoveMember();
        }
    }

    public void DisableGroup()
    {
        Status = GroupStatus.Disabled;
    }

    public void UpdateInfo(string? name, string? imageUrl)
    {
        if (!string.IsNullOrWhiteSpace(name))
            Name = name;

        if (imageUrl is not null)
            ImageUrl = imageUrl;

        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public bool IsActiveMember(Guid userId)
    { return _members.Any(ug => ug.User.Slug == userId && ug.Status == GroupMembershipStatus.Active);
    }

    public void CreateUserBalance(long userId, decimal paidAmount, decimal splitAmount)
    {
        var balance = paidAmount - splitAmount;
        
    }
   

}