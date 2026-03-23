using Ardalis.SmartEnum;

namespace Lenden.Domain.Entities;

public sealed class ExpenseCategory : SmartEnum<ExpenseCategory>
{
    public static readonly ExpenseCategory Accommodation = new(nameof(Accommodation), 1);
    public static readonly ExpenseCategory HouseholdUtilities = new("Household_Utilities", 2);
    public static readonly ExpenseCategory FoodGroceries = new("Food_Groceries", 3);
    public static readonly ExpenseCategory TransportationTravel = new("Transportation_Travel", 4);
    public static readonly ExpenseCategory LifestylePersonal = new("Lifestyle_Personal", 5);

    private ExpenseCategory(string name, int value)
        : base(name, value) { }
}