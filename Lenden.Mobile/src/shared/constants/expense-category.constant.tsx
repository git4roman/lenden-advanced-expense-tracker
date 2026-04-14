import { MaterialIcons } from "@expo/vector-icons";

export type ExpenseCategory = {
  id: number;
  key: string;
  label: string;
  tags: string[];
  iconName: keyof typeof MaterialIcons.glyphMap;
};

export const ExpenseCategories: ExpenseCategory[] = [
  {
    id: 1,
    key: "Accommodation",
    label: "Accommodation",
    tags: ["Rent", "Deposit", "Maintenance", "Room Repairs"],
    iconName: "apartment",
  },
  {
    id: 2,
    key: "Household",
    label: "Household & Utilities",
    tags: [
      "Electricity",
      "Water",
      "Garbage",
      "Internet",
      "LPG Gas",
      "Cleaning Supplies",
      "Household Items",
    ],
    iconName: "electrical-services",
  },
  {
    id: 3,
    key: "Groceries",
    label: "Food & Groceries",
    tags: [
      "Groceries",
      "Vegetables",
      "Cooking Essentials",
      "Eating Out",
      "Food Delivery",
    ],
    iconName: "local-grocery-store",
  },
  {
    id: 4,
    key: "Travel",
    label: "Transportation & Travel",
    tags: ["Petrol", "Taxi/Pathao", "Bus Fare", "Trips"],
    iconName: "directions-bus",
  },
  {
    id: 5,
    key: "Personal",
    label: "Lifestyle & Personal",
    tags: [
      "Entertainment",
      "Subscriptions",
      "Mobile Recharge",
      "Gym",
      "Health & Medication",
    ],
    iconName: "person",
  },
];
