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
        Status = FriendshipStatus.Pending;
        CreatedAt = DateTimeOffset.UtcNow;
    }
    public long RequesterId { get; private set; }
    public UserEntity Requester { get; private set; }
    public long RecipientId { get; private set; }
    public UserEntity Recipient { get; private set; }
    public FriendshipStatus Status { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset UpdatedAt { get; private set; }

    public void AcceptFriendRequest()
    {
        Status= FriendshipStatus.Accepted;
        UpdatedAt = DateTimeOffset.UtcNow;
    }
    
    public void RejectFriendRequest()
    {
        Status = FriendshipStatus.Rejected;
        UpdatedAt = DateTimeOffset.UtcNow;
    }
}