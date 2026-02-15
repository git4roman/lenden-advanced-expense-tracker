using Ardalis.SmartEnum;

namespace Lenden.Domain.Entities;

public sealed class UserRole : SmartEnum<UserRole>
{
    public static readonly UserRole Admin    = new(nameof(Admin), 1);
    public static readonly UserRole Merchant = new(nameof(Merchant), 2);
    public static readonly UserRole Customer = new(nameof(Customer), 3);

    private UserRole(string name, int value)
        : base(name, value) { }
}