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
    }
    public long Id { get; private set; } 
    public Guid PublicId { get; private set; } = Guid.NewGuid(); 
    public string Name { get; private set; }
    public string ImageUrl { get; private set; }
    public long CreatedBy { get; private set; } 
    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset UpdatedAt { get; private set; }

    private readonly List<UserGroupEntity> _members;
    public IReadOnlyCollection<UserGroupEntity> Members => _members.AsReadOnly();

    private readonly List<UserBalanceEntity> _userBalances;
    public IReadOnlyCollection<UserBalanceEntity> UserBalances => _userBalances.AsReadOnly();
    
    // private readonly List<ExpenseEntity> _expenses;
    // public IReadOnlyCollection<ExpenseEntity> Expenses => _expenses.AsReadOnly();

    public void AddMember(UserEntity user, long invitedByUserId, bool isCreator = false)
    {
        if (_members.Any(ug => ug.UserId == user.Id && ug.Status == GroupMembershipStatus.Active))
            return; 

        var role = isCreator ? UserGroupRole.Admin : UserGroupRole.Member;

        _members.Add(new UserGroupEntity(
            userId: user.Id,
            groupId: Id,
            role: role,
            invitedByUserId
        ));
    }
    
    public void AddMembersBulk(IEnumerable<UserEntity> users, long invitedByUserId)
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
                groupId: Id,
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

    public void UpdateInfo(string? name, string? imageUrl)
    {
        if (!string.IsNullOrWhiteSpace(name))
            Name = name;

        if (imageUrl is not null)
            ImageUrl = imageUrl;

        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public bool IsActiveMember(Guid userId)
    { return _members.Any(ug => ug.User.PublicId == userId && ug.Status == GroupMembershipStatus.Active);
    }

    public UserBalanceEntity CreateUserBalance(long groupId, long creditorId, long debtorId)
    {
        return  UserBalanceEntity.Create(groupId, creditorId, debtorId);
    }

    // public void RemoveExpense(ExpenseEntity expense)
    // {
    //     
    //     _expenses.Remove(expense);
    //     
    // }
    
   
}