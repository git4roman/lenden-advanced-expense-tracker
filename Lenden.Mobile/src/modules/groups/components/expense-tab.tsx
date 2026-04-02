import { View, FlatList, Pressable, ActivityIndicator } from "react-native";
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
  const [visibleCount, setVisibleCount] = React.useState(5);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const loadMoreTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  React.useEffect(() => {
    setVisibleCount(5);
  }, [groupId, filterKey]);

  React.useEffect(() => {
    return () => {
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current);
      }
    };
  }, []);

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

  const pagedExpenses = React.useMemo(
    () => filteredExpenses.slice(0, visibleCount),
    [filteredExpenses, visibleCount],
  );

  const activityData = React.useMemo(
    () =>
      pagedExpenses.map((expense: any) => {
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
    [pagedExpenses],
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

  const canLoadMore = visibleCount < filteredExpenses.length;

  const handleLoadMore = React.useCallback(() => {
    if (!canLoadMore || isLoadingMore) return;
    setIsLoadingMore(true);
    loadMoreTimeoutRef.current = setTimeout(() => {
      setVisibleCount((prev) => prev + 5);
      setIsLoadingMore(false);
    }, 500);
  }, [canLoadMore, isLoadingMore]);

  const checkLoadMore = React.useCallback(
    (nativeEvent: any) => {
      const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
      const paddingToBottom = 64;
      const isNearBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
      if (isNearBottom) {
        handleLoadMore();
      }
    },
    [handleLoadMore],
  );

  return (
    <FlatList
      data={groupedActivityData}
      keyExtractor={(item) => item.date}
      style={{ borderColor: "transparent", flex: 1 }}
      contentContainerStyle={{ paddingTop: 4, paddingBottom: 96 }}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.4}
      onEndReached={() => handleLoadMore()}
      ListFooterComponent={
        isLoadingMore || canLoadMore ? (
          <View
            style={{
              paddingVertical: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isLoadingMore ? (
              <ActivityIndicator size="small" color={Colors.neutral[400]} />
            ) : (
              <CText size="ssm" color="neutral" shade={500}>
                Scroll to load more
              </CText>
            )}
          </View>
        ) : null
      }
      renderItem={({ item: group }) => (
        <View style={{ gap: 10, marginBottom: 12 }}>
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
                  marginHorizontal: 10,
                  paddingHorizontal: 10,
                }}
              >
                <ActivityItem item={item} />
              </Pressable>
            ))}
          </View>
        </View>
      )}
    />
  );
};

export default ExpenseTab;
