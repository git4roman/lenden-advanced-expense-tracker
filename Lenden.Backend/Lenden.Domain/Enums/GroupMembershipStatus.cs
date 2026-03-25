using Ardalis.SmartEnum;

namespace Lenden.Domain.Entities;

public class GroupMembershipStatus: SmartEnum<GroupMembershipStatus,int>
{
    public static readonly GroupMembershipStatus Active  = new(nameof(Active), 1);
    public static readonly GroupMembershipStatus Disabled = new(nameof(Disabled), 2);
    public static readonly GroupMembershipStatus Banned = new(nameof(Banned), 3);

    private GroupMembershipStatus(string name, int value)
        : base(name, value) { }
}