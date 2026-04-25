import {
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React from "react";
import { CText } from "@/src/shared/ui/components/CText";
import { ActivityItem } from "./activity-item";
import { Colors } from "@/src/shared/ui/theme/colors";
import { router } from "expo-router";
import { useGetExpensesQuery } from "@/src/shared/store/apiSlices/expense-slice.api";
import { formatDateTime } from "@/src/shared/utils/format-date-expense.utils";

export const EXPENSE_FILTER_OPTIONS = [
  { key: "all", label: "All", days: 36500 },
  { key: "7d", label: "7 Days", days: 7 },
  { key: "1w", label: "1 Week", days: 7 },
  { key: "1m", label: "1 Month", days: 30 },
  { key: "3m", label: "3 Months", days: 90 },
  { key: "6m", label: "6 Months", days: 180 },
  { key: "1y", label: "1 Year", days: 365 },
] as const;

type FilterKey = (typeof EXPENSE_FILTER_OPTIONS)[number]["key"];

type ActivityData = {
  date: string;
  time: string;
  categoryKey: string;
  description: string;
  amount: string;
};

type GroupedActivity = {
  date: string;
  items: ActivityData[];
};

type ExpenseTabProps = {
  groupId: string;
  filterKey?: FilterKey;
  ListHeaderComponent?: React.ReactElement;
  refreshing?: boolean;
  onRefresh?: () => void;
};

const INITIAL_VISIBLE_COUNT = 5;
const LOAD_MORE_COUNT = 5;
const LOAD_MORE_DELAY = 500;

const buildDescription = (payers: any[], categoryKey: string): string => {
  const names = payers.map((p) => p.givenName);
  if (names.length === 0) return `Expense added for ${categoryKey}`;
  if (names.length === 1) return `${names[0]} paid for ${categoryKey}`;
  if (names.length === 2)
    return `${names[0]} and ${names[1]} paid for ${categoryKey}`;
  const last = names[names.length - 1];
  const rest = names.slice(0, -1).join(", ");
  return `${rest}, and ${last} paid for ${categoryKey}`;
};

const toActivityData = (expense: any): ActivityData => {
  const { date, time } = formatDateTime(expense.createdAt);
  const payers = expense?.participants?.filter((p: any) => p.paid > 0) ?? [];
  return {
    date,
    time,
    categoryKey: expense.categoryKey ?? "other",
    description: buildDescription(payers, expense.categoryKey),
    amount: expense.totalAmount?.toString() ?? "0",
  };
};

const groupByDate = (items: ActivityData[]): GroupedActivity[] => {
  const map = new Map<string, ActivityData[]>();
  for (const item of items) {
    const existing = map.get(item.date) ?? [];
    existing.push(item);
    map.set(item.date, existing);
  }
  return Array.from(map.entries()).map(([date, items]) => ({ date, items }));
};

const filterAndSortExpenses = (expenses: any[], filterKey?: FilterKey) => {
  const selected =
    EXPENSE_FILTER_OPTIONS.find((o) => o.key === filterKey) ??
    EXPENSE_FILTER_OPTIONS[0];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - selected.days);
  return [...expenses]
    .filter((e) => {
      const d = new Date(e.createdAt);
      return !Number.isNaN(d.getTime()) && d >= cutoff;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
};

const ExpenseTab = ({
  groupId,
  filterKey,
  ListHeaderComponent,
  refreshing,
  onRefresh,
}: ExpenseTabProps) => {
  const { data: expenses } = useGetExpensesQuery(groupId);
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_VISIBLE_COUNT);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const loadMoreTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  React.useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [groupId, filterKey]);

  React.useEffect(() => {
    return () => {
      if (loadMoreTimeout.current) clearTimeout(loadMoreTimeout.current);
    };
  }, []);

  const filteredExpenses = React.useMemo(
    () => filterAndSortExpenses(expenses ?? [], filterKey),
    [expenses, filterKey],
  );

  const groupedActivityData = React.useMemo<GroupedActivity[]>(() => {
    const paged = filteredExpenses.slice(0, visibleCount);
    const mapped = paged.map(toActivityData);
    const grouped = groupByDate(mapped);
    return grouped;
  }, [filteredExpenses, visibleCount]);

  const canLoadMore = visibleCount < filteredExpenses.length;

  const handleLoadMore = React.useCallback(() => {
    if (!canLoadMore || isLoadingMore) return;
    setIsLoadingMore(true);
    loadMoreTimeout.current = setTimeout(() => {
      setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
      setIsLoadingMore(false);
    }, LOAD_MORE_DELAY);
  }, [canLoadMore, isLoadingMore]);

  const renderFooter = () => {
    if (!isLoadingMore && !canLoadMore) return null;
    return (
      <View style={{ paddingVertical: 12, alignItems: "center" }}>
        {isLoadingMore ? (
          <ActivityIndicator size="small" color={Colors.neutral[400]} />
        ) : (
          <CText size="ssm" color="neutral" shade={500}>
            Scroll to load more
          </CText>
        )}
      </View>
    );
  };

  const renderGroup = ({ item: group }: { item: GroupedActivity }) => {
    return (
      <View style={{ gap: 10, marginBottom: 12 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            marginBottom: 4,
          }}
        >
          <CText
            color="neutral"
            shade={400}
            size="ssm"
            weight="medium"
            style={{ paddingHorizontal: 10 }}
          >
            {group.date}
          </CText>
          <View
            style={{ flex: 1, height: 1, backgroundColor: Colors.neutral[700] }}
          />
        </View>

        <View style={{ borderRadius: 10, gap: 10 }}>
          {group.items.map((item, index) => (
            <Pressable
              key={`${group.date}-${index}`}
              onPress={() =>
                router.push({
                  pathname: "/(stack)/groups/[groupId]/details",
                  params: {
                    groupId,
                    date: item.date,
                    time: item.time,
                    categoryKey: item.categoryKey,
                    description: item.description,
                    amount: item.amount,
                  },
                })
              }
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
    );
  };

  return (
    <FlatList
      data={groupedActivityData}
      keyExtractor={(item) => item.date}
      renderItem={renderGroup}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={renderFooter}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingTop: 4, paddingBottom: 96 }}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.4}
      onEndReached={handleLoadMore}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing ?? false}
            onRefresh={onRefresh}
            tintColor={Colors.neutral[200]}
            colors={[Colors.accent[400]]}
          />
        ) : undefined
      }
    />
  );
};

export default ExpenseTab;
