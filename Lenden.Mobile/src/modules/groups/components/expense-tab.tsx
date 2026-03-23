import { View, ScrollView, Pressable } from "react-native";
import React from "react";
import { CText } from "@/src/shared/ui/components/CText";
import { ActivityItem } from "./activity-item";
import { Colors } from "@/src/shared/ui/theme/colors";
import { router, useLocalSearchParams } from "expo-router";
import { useGetExpensesQuery } from "@/src/shared/store/apiSlices/expense-slice.api";
import { formatDateTime } from "@/src/shared/utils/format-date-expense.utils";

const activityMockData = [
  {
    date: "19 Jan",
    time: "12:00 PM",
    categoryKey: "food_groceries", // key instead of label
    description: "Roman and 3 others bought groceries from BhatBhateni",
    amount: "2000",
  },
  {
    date: "19 Jan",
    time: "08:45 AM",
    categoryKey: "transportation_travel",
    description: "Roman paid for a taxi ride",
    amount: "650",
  },
  {
    date: "20 Jan",
    time: "07:30 AM",
    categoryKey: "accommodation",
    description: "Monthly room rent paid by Roman",
    amount: "8000",
  },
  {
    date: "20 Jan",
    time: "09:00 AM",
    categoryKey: "household_utilities",
    description: "Internet bill for shared WiFi paid",
    amount: "1200",
  },
  {
    date: "21 Jan",
    time: "06:30 PM",
    categoryKey: "lifestyle_personal",
    description: "Netflix subscription shared among roommates",
    amount: "500",
  },
  {
    date: "21 Jan",
    time: "08:00 PM",
    categoryKey: "food_groceries",
    description: "Dinner at Newa Lahana by Roman and 2 others",
    amount: "1500",
  },
  {
    date: "22 Jan",
    time: "08:00 AM",
    categoryKey: "household_utilities",
    description: "LPG cylinder refill for cooking",
    amount: "2500",
  },
  {
    date: "20 Jan",
    time: "09:00 AM",
    categoryKey: "household_utilities",
    description: "Internet bill for shared WiFi paid",
    amount: "1200",
  },
  {
    date: "21 Jan",
    time: "06:30 PM",
    categoryKey: "lifestyle_personal",
    description: "Netflix subscription shared among roommates",
    amount: "500",
  },
  {
    date: "21 Jan",
    time: "08:00 PM",
    categoryKey: "food_groceries",
    description: "Dinner at Newa Lahana by Roman and 2 others",
    amount: "1500",
  },
  {
    date: "22 Jan",
    time: "08:00 AM",
    categoryKey: "household_utilities",
    description: "LPG cylinder refill for cooking",
    amount: "2500",
  },
];

const ExpenseTab = ({ groupId }: { groupId: string }) => {
  const { data: expenses } = useGetExpensesQuery(groupId as string);
  console.log("The Expenses Data is:", JSON.stringify(expenses, null, 2));
  const activityData =
    expenses?.map((expense: any) => {
      const { date, time } = formatDateTime(expense.createdAt);

      const payers = expense.participants.filter((p: any) => p.paid > 0);

      const payerNames = payers.map((p: any) => p.givenName);

      let description = "";

      if (payerNames.length === 1) {
        description = `${payerNames[0]} paid for ${expense.categoryKey}`;
      } else if (payerNames.length === 2) {
        description = `${payerNames[0]} and ${payerNames[1]} paid for ${expense.categoryKey}`;
      } else if (payerNames.length > 2) {
        const last = payerNames.pop();
        description = `${payerNames.join(", ")}, and ${last} paid for ${expense.categoryKey}`;
      } else {
        description = `Expense added for ${expense.categoryKey}`;
      }

      return {
        date,
        time,
        categoryKey: expense.categoryKey ?? "other",
        description,
        amount: expense.totalAmount?.toString() ?? "0",
      };
    }) ?? [];
  return (
    <ScrollView
      style={{ borderColor: "transparent" }}
      contentContainerStyle={{ paddingTop: 4, paddingBottom: 64 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ gap: 12 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginBottom: 4,
          }}
        >
          <CText
            color="neutral"
            shade={400}
            size="ssm"
            style={{ paddingHorizontal: 10 }}
            weight="medium"
          >
            Fri, FEB 6
          </CText>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: Colors.neutral[700],
            }}
          />
        </View>
        <View
          style={{
            borderRadius: 10,
            gap: 10,
          }}
        >
          {activityData.map((item: any, index: number) => (
            <Pressable
              key={index}
              onPress={() => {
                router.push({
                  pathname: "/(tabs)/(groups)/[groupId]/details",
                  params: {
                    groupId: groupId ?? "",
                    date: item.date,
                    time: item.time,
                    categoryKey: item.categoryKey,
                    description: item.description,
                    amount: item.amount,
                  },
                });
              }}
              style={{
                backgroundColor: Colors.neutral[800],
                borderWidth: 1,
                borderRadius: 12,
                borderColor: Colors.neutral[700],
                paddingHorizontal: 10,
                paddingVertical: 2,
              }}
            >
              <ActivityItem item={item} />
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ExpenseTab;
