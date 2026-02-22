namespace Lenden.Domain.Entities;

public class GroupEntity
{
    protected GroupEntity()
    {
    } // EF Core

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

    // Navigation property
    private readonly List<UserBalanceEntity> _userBalances;
    public IReadOnlyCollection<UserBalanceEntity> UserBalances => _userBalances.AsReadOnly();
    
    // Navigation property
    private readonly List<ExpenseEntity> _expenses;
    public IReadOnlyCollection<ExpenseEntity> Expenses => _expenses.AsReadOnly();

    public void AddUser(UserEntity user, UserEntity invitedBy = null, bool isCreator = false)
    {
        if (_userGroups.Any(ug => ug.UserId == user.Id && ug.Status == GroupMembershipStatus.Active))
            return; // already an active member

        var role = isCreator ? UserGroupRole.Admin : UserGroupRole.Member;

        _userGroups.Add(new UserGroupEntity(
            userId: user.Id,
            groupId: Id,
            role: role,
            invitedByUserId: invitedBy?.Id
        ));
    }

    public void RemoveUser(long userId)
    {
        var userGroup = _userGroups
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
    { return _userGroups.Any(ug => ug.User.PublicId == userId && ug.Status == GroupMembershipStatus.Active);
    }

    public UserBalanceEntity CreateUserBalance(long groupId, long creditorId, long debtorId)
    {
        return  UserBalanceEntity.Create(groupId, creditorId, debtorId);
    }

    public void RemoveExpense(ExpenseEntity expense)
    {
        
        _expenses.Remove(expense);
        
    }
    
   
}