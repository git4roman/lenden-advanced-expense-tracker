using Ardalis.SmartEnum;

namespace Lenden.Domain.Entities;

public class SettlementStatusEnums : SmartEnum<SettlementStatusEnums>
{
    public static readonly SettlementStatusEnums Pending = new(nameof(Pending), 1);
    public static readonly SettlementStatusEnums Completed = new(nameof(Completed), 2);
    public static readonly SettlementStatusEnums Rejected = new(nameof(Rejected), 3);
    private SettlementStatusEnums(string name, int value)
        : base(name, value)
    {
    }

}