using Ardalis.SmartEnum;

namespace Lenden.Domain.Entities;

public sealed class UserStatus : SmartEnum<UserStatus>
{
    public static readonly UserStatus Active   = new(nameof(Active), 1);
    public static readonly UserStatus Disabled = new(nameof(Disabled), 2);
    public static readonly UserStatus Locked   = new(nameof(Locked), 3);
    public static readonly UserStatus InActive   = new(nameof(InActive), 3);

    private UserStatus(string name, int value)
        : base(name, value) { }

    public bool CanLogin() => this == Active;
}