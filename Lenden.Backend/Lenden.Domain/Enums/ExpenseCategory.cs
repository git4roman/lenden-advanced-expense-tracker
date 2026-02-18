using Ardalis.SmartEnum;

namespace Lenden.Domain.Entities;

public sealed class ExpenseCategory : SmartEnum<ExpenseCategory>
{
    public static readonly ExpenseCategory Accommodation = new(nameof(Accommodation), 1);
    public static readonly ExpenseCategory HouseholdUtilities = new(nameof(HouseholdUtilities), 2);
    public static readonly ExpenseCategory FoodGroceries = new(nameof(FoodGroceries), 3);
    public static readonly ExpenseCategory TransportationTravel = new(nameof(TransportationTravel), 4);
    public static readonly ExpenseCategory LifestylePersonal = new(nameof(LifestylePersonal), 5);

    private ExpenseCategory(string name, int value)
        : base(name, value) { }
}