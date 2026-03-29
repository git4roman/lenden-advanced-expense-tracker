import { View, ScrollView, Pressable } from "react-native";
import React from "react";
import { CText } from "@/src/shared/ui/components/CText";
import { ActivityItem } from "./activity-item";
import { Colors } from "@/src/shared/ui/theme/colors";
import { router } from "expo-router";
import { useGetExpensesQuery } from "@/src/shared/store/apiSlices/expense-slice.api";
import { formatDateTime } from "@/src/shared/utils/format-date-expense.utils";

export const EXPENSE_FILTER_OPTIONS = [
  { key: "7d", label: "7 Days", days: 7 },
  { key: "1w", label: "1 Week", days: 7 },
  { key: "1m", label: "1 Month", days: 30 },
  { key: "3m", label: "3 Months", days: 90 },
  { key: "6m", label: "6 Months", days: 180 },
  { key: "1y", label: "1 Year", days: 365 },
];

type ExpenseTabProps = {
  groupId: string;
  filterKey?: string;
};

const ExpenseTab = ({ groupId, filterKey }: ExpenseTabProps) => {
  const { data: expenses } = useGetExpensesQuery(groupId as string);

  const filteredExpenses = React.useMemo(() => {
    const items = expenses ?? [];
    const selected =
      EXPENSE_FILTER_OPTIONS.find((option) => option.key === filterKey) ??
      EXPENSE_FILTER_OPTIONS[0];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - selected.days);
    return items
      .filter((expense: any) => {
        const createdAt = new Date(expense.createdAt);
        if (Number.isNaN(createdAt.getTime())) {
          return false;
        }
        return createdAt >= cutoff;
      })
      .slice()
      .sort((a: any, b: any) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return bTime - aTime;
      });
  }, [expenses, filterKey]);

  const activityData = React.useMemo(
    () =>
      filteredExpenses.map((expense: any) => {
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
      }),
    [filteredExpenses],
  );

  const groupedActivityData = React.useMemo(() => {
    const grouped = new Map<string, typeof activityData>();
    for (const item of activityData) {
      const list = grouped.get(item.date) ?? [];
      list.push(item);
      grouped.set(item.date, list);
    }
    return Array.from(grouped.entries()).map(([date, items]) => ({
      date,
      items,
    }));
  }, [activityData]);

  return (
    <ScrollView
      style={{ borderColor: "transparent", flex: 1 }}
      contentContainerStyle={{ paddingTop: 4, paddingBottom: 96 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ gap: 12 }}>
        {groupedActivityData.map((group) => (
          <View key={group.date} style={{ gap: 10 }}>
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
                {group.date}
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
              {group.items.map((item, index) => (
                <Pressable
                  key={`${group.date}-${index}`}
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
        ))}
      </View>
    </ScrollView>
  );
};

export default ExpenseTab;
