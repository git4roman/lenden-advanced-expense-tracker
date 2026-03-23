import React from "react";
import { Pressable, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";

const getCategoryLabel = (categoryKey?: string) => {
  const labels: Record<string, string> = {
    accommodation: "Accommodation",
    household_utilities: "Household & Utilities",
    food_groceries: "Food & Groceries",
    transportation_travel: "Transportation & Travel",
    lifestyle_personal: "Lifestyle & Personal",
  };

  if (!categoryKey) return "Unknown";
  return labels[categoryKey] ?? categoryKey;
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={{ gap: 4 }}>
    <CText size="xs" color="neutral" shade={500}>
      {label}
    </CText>
    <CText size="sm" color="neutral" shade={200} weight="semibold">
      {value}
    </CText>
  </View>
);

const GroupExpenseDetails = () => {
  const canRequest = false;
  const { groupId, date, time, categoryKey, description, amount } =
    useLocalSearchParams<{
      groupId?: string;
      date?: string;
      time?: string;
      categoryKey?: string;
      description?: string;
      amount?: string;
    }>();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.neutral[900],
        paddingHorizontal: 12,
        paddingVertical: 10,
      }}
    >
      <Stack.Screen options={{ title: "Expense Details" }} />

      <View
        style={{
          borderWidth: 1,
          borderColor: Colors.neutral[700],
          backgroundColor: Colors.neutral[800],
          borderRadius: 14,
          padding: 14,
          gap: 14,
        }}
      >
        <DetailRow label="Description" value={description ?? "-"} />
        <DetailRow label="Category" value={getCategoryLabel(categoryKey)} />
        <DetailRow label="Amount" value={`NPR ${amount ?? "-"}`} />
        <DetailRow label="Date" value={date ?? "-"} />
        <DetailRow label="Time" value={time ?? "-"} />
      </View>

      {/* <Pressable
        onPress={() => {
          router.push(
            canRequest
              ? {
                  pathname: "/(tabs)/(quickActions)/request",
                  params: {
                    from: "groupDetails",
                    groupId: groupId ?? "",
                    date: date ?? "",
                    time: time ?? "",
                    categoryKey: categoryKey ?? "",
                    description: description ?? "",
                    amount: amount ?? "",
                  },
                }
              : {
                  pathname: "/(tabs)/(quickActions)/pay",
                  params: {
                    from: "groupDetails",
                    groupId: groupId ?? "",
                    date: date ?? "",
                    time: time ?? "",
                    categoryKey: categoryKey ?? "",
                    description: description ?? "",
                    amount: amount ?? "",
                  },
                },
          );
        }}
        style={{
          marginTop: 14,
          borderRadius: 12,
          paddingVertical: 12,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: canRequest
            ? Colors.accent[500]
            : Colors.warning[500],
        }}
      >
        <CText weight="bold" size="sm" color="neutral" shade={900}>
          {canRequest ? "Request" : "Pay"}
        </CText>
      </Pressable> */}
    </SafeAreaView>
  );
};

export default GroupExpenseDetails;
