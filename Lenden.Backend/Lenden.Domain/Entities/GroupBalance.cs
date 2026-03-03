namespace Lenden.Domain.Entities;

public class GroupBalance
{
    private GroupBalance()
    {
        
    }
    
    public GroupBalance(long groupId, long userId, decimal net)
    {
        GroupId = groupId;
        UserId = userId;
        Net = net;
    }
    public Guid Id { get; set; }
    public long GroupId { get; set; }
    public long UserId { get; set; }
    public decimal Net { get; set; }
}