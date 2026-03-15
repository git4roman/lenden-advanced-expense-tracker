namespace Lenden.Domain.Entities;

public class FriendshipEntity
{
    private FriendshipEntity()
    {
        
    }
    
    public FriendshipEntity(long requesterId, long recipientId)
    {
        RequesterId= requesterId;
        RecipientId = recipientId;
    }
    public long RequesterId { get; private set; }
    public UserEntity Requester { get; private set; }
    public long RecipientId { get; private set; }
    public UserEntity Recipient { get; private set; }
    public FriendshipStatus Status { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }
}