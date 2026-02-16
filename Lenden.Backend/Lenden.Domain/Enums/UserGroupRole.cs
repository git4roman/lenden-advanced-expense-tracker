using Ardalis.SmartEnum;

namespace Lenden.Domain.Entities;

public class UserGroupRole: SmartEnum<UserGroupRole>
{
    public static readonly UserGroupRole Admin  = new(nameof(Admin), 1);
    public static readonly UserGroupRole Member = new(nameof(Member), 2);

    private UserGroupRole(string name, int value)
        : base(name, value) { }
}