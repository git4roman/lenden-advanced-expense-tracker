using Ardalis.SmartEnum;

namespace Lenden.Domain.Entities;

public sealed class ExpenseCategory : SmartEnum<ExpenseCategory>
{
    public static readonly ExpenseCategory Accommodation = new(nameof(Accommodation), 1);
    public static readonly ExpenseCategory Household = new(nameof(Household), 2);
    public static readonly ExpenseCategory Groceries = new(nameof(Groceries),3);
    public static readonly ExpenseCategory Travel = new(nameof(Travel),4);
    public static readonly ExpenseCategory Personal = new(nameof(Personal), 5);

    private ExpenseCategory(string name, int value)
        : base(name, value) { }
}