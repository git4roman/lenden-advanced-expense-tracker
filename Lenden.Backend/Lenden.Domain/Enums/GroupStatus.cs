using Ardalis.SmartEnum;

namespace Lenden.Domain.Entities;

public class GroupStatus: SmartEnum<GroupStatus>
{
    public static readonly GroupStatus Active = new(nameof(Active), 1);
    public static readonly GroupStatus Disabled = new(nameof(Disabled), 2);
    

    private GroupStatus(string name, int value)
        : base(name, value) { }
}