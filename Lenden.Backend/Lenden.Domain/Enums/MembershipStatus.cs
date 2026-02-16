using Ardalis.SmartEnum;

namespace Lenden.Domain.Entities;

public class MembershipStatus: SmartEnum<MembershipStatus>
{
    public static readonly MembershipStatus Active  = new(nameof(Active), 1);
    public static readonly MembershipStatus Disabled = new(nameof(Disabled), 2);
    public static readonly MembershipStatus Banned = new(nameof(Banned), 2);

    private MembershipStatus(string name, int value)
        : base(name, value) { }
}