import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { MaterialIcons, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

const sharedExpenseCategories = [
  {
    key: "accommodation",
    label: "Accommodation",
    tags: ["Rent", "Deposit", "Maintenance", "Room Repairs"],
    icon: (
      <MaterialIcons name="apartment" size={22} color={Colors.neutral[300]} />
    ),
  },
  {
    key: "household_utilities",
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
    key: "food_groceries",
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
    key: "transportation_travel",
    label: "Transportation & Travel",
    tags: ["Petrol", "Taxi/Pathao", "Bus Fare", "Trips"],
    icon: (
      <FontAwesome6 name="train-subway" size={22} color={Colors.neutral[300]} />
    ),
  },
  {
    key: "lifestyle_personal",
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

export const ActivityItem = ({ item }: any) => {
  const category = sharedExpenseCategories.find(
    (cat) => cat.key === item.categoryKey,
  );
  return (
    <View
      style={{
        flexDirection: "row",
        minHeight: 84,
        paddingVertical: 10,
        paddingHorizontal: 6,
        paddingLeft: 0,
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 12,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 20,
          backgroundColor: Colors.neutral[700],
        }}
      >
        {category?.icon}
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <View style={{ flex: 1, justifyContent: "space-between", gap: 4 }}>
          <CText
            size="ssm"
            color="neutral"
            shade={200}
            letterSpacing={0.3}
            numberOfLines={2}
          >
            {item.description}
          </CText>
          <CText size="xs" color="neutral" shade={500}>
            {item.time}
          </CText>
        </View>
        <View style={{}}>
          <CText size="ssm" weight="semibold" color="accent" shade={300}>
            NPR. {item.amount}
          </CText>
        </View>
      </View>
    </View>
  );
};
