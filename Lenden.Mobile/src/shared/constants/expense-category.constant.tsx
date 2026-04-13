import { MaterialIcons, FontAwesome, FontAwesome6 } from "@expo/vector-icons";

import { ReactNode } from "react";

export type ExpenseCategory = {
  id: number;
  key: string;
  label: string;
  tags: string[];
  icon: ReactNode;
};
export const sharedExpenseCategories =(Colors: any)=> [
  {
    id: 1,
    key: "Accommodation",
    label: "Accommodation",
    tags: ["Rent", "Deposit", "Maintenance", "Room Repairs"],
    icon: (
      <MaterialIcons name="apartment" size={22} color={Colors.neutral[300]} />
    ),
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
    icon: (
      <MaterialIcons
        name="electric-bolt"
        size={22}
        color={Colors.neutral[300]}
      />
    ),
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
      "Tea/Coffee",
    ],
    icon: (
      <FontAwesome
        name="shopping-basket"
        size={22}
        color={Colors.neutral[300]}
      />
    ),
  },
  {
    id: 4,
    key: "Travel",
    label: "Transportation & Travel",
    tags: ["Petrol", "Taxi/Pathao", "Bus Fare", "Trips"],
    icon: (
      <FontAwesome6 name="train-subway" size={22} color={Colors.neutral[300]} />
    ),
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
      "Clothing",
      "Miscellaneous",
    ],
    icon: (
      <MaterialIcons
        name="local-grocery-store"
        size={22}
        color={Colors.neutral[300]}
      />
    ),
  },
];