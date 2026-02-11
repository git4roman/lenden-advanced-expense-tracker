import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { MaterialIcons, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";

const sharedExpenseCategories = [
  {
    key: "accommodation",
    label: "Accommodation",
    tags: ["Rent", "Deposit", "Maintenance", "Room Repairs"],
    icon: (
      <MaterialIcons name="apartment" size={24} color={Colors.neutral[500]} />
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
        size={24}
        color={Colors.neutral[500]}
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
        size={24}
        color={Colors.neutral[500]}
      />
    ),
  },
  {
    key: "transportation_travel",
    label: "Transportation & Travel",
    tags: ["Petrol", "Taxi/Pathao", "Bus Fare", "Trips"],
    icon: (
      <FontAwesome6 name="train-subway" size={24} color={Colors.neutral[500]} />
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
        size={24}
        color={Colors.neutral[500]}
      />
    ),
  },
];

export const ActivityItem = ({ item }: any) => {
  const category = sharedExpenseCategories.find(
    (cat) => cat.key === item.categoryKey,
  );
  return (
    <Pressable
      onPress={() => {
        console.log("first");
      }}
      style={{
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 6,
        paddingLeft: 0,
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 8,
      }}
    >
      <View
        style={{
          width: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {category?.icon}
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <View style={{ flex: 1, gap: 12 }}>
          <CText size="ssm" color="neutral" shade={100} letterSpacing={0.4}>
            {item.description}
          </CText>
          {/* <CText color="neutral" shade={100}>
          {item.date}
        </CText> */}
          <CText size="xs" color="neutral" shade={100}>
            {item.time}
          </CText>
        </View>
        <View style={{}}>
          <CText size="ssm" weight="medium" italic color="neutral" shade={100}>
            NPR. {item.amount}
          </CText>
        </View>
      </View>
    </Pressable>
  );
};
