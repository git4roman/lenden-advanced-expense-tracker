namespace Lenden.Domain.Entities;

public class GroupEntity
{
    protected GroupEntity() { } // EF Core
    public GroupEntity(string name, string imageUrl, int createdBy)
    {
        Name = name;
        ImageUrl = imageUrl;
        CreatedBy = createdBy;
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = DateTimeOffset.UtcNow;
        _userGroups = new List<UserGroupEntity>();
    }

    public int Id { get; private set; }
    public string Name { get; private set; }
    public string ImageUrl { get; private set; }
    public int CreatedBy { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset UpdatedAt { get; private set; }

    private readonly List<UserGroupEntity> _userGroups;
    public IReadOnlyCollection<UserGroupEntity> UserGroups => _userGroups.AsReadOnly();
}
