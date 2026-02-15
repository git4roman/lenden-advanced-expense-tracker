namespace Lenden.Domain.Entities;

public class UserGroupEntity
{
    protected UserGroupEntity() { }

    public UserGroupEntity(int userId, int groupId)
    {
        UserId = userId;
        GroupId = groupId;
    }
    
    public int UserId { get; set; }
    public int GroupId { get; set; }
    public UserEntity User { get; set; }
    public GroupEntity Group { get; set; }
}