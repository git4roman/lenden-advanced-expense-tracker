using Ardalis.SmartEnum;

namespace Lenden.Domain.Entities;

public class ExpenseParticipantType: SmartEnum<ExpenseParticipantType>
{
    public static readonly ExpenseParticipantType Payer  = new(nameof(Payer), 1);
    public static readonly ExpenseParticipantType Splitter = new(nameof(Splitter), 2);

    private ExpenseParticipantType(string name, int value)
        : base(name, value) { }
}