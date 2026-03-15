using Ardalis.SmartEnum;

namespace Lenden.Domain.Entities;

public sealed class FriendshipStatus : SmartEnum<FriendshipStatus>
{
    public static readonly FriendshipStatus Accepted = new(nameof(Accepted), 1);
    public static readonly FriendshipStatus Rejected = new(nameof(Rejected), 2);
    public static readonly FriendshipStatus Pending = new(nameof(Pending), 3);
    public static readonly FriendshipStatus Blocked = new(nameof(Blocked), 4);

    private FriendshipStatus(string name, int value)
        : base(name, value) { }
}