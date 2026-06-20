import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  View,
} from "react-native";
import { useGroupContext } from "../providers";
import { ActivityItem } from "./activity-item";

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

export type ActivityData = {
  date: string;
  time: string;
  categoryKey: string;
  description: string;
  cost: string;
};

type ExpenseTabProps = {
  filterKey?: FilterKey;
  ListHeaderComponent?: React.ReactElement;
  refreshing?: boolean;
};

const INITIAL_VISIBLE_COUNT = 5;
const LOAD_MORE_COUNT = 5;
const LOAD_MORE_DELAY = 500;

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
  filterKey,
  ListHeaderComponent,
  refreshing,
}: ExpenseTabProps) => {
  // const { data: expenses } = useGetExpensesQuery(groupId);

  const { group, handleRefresh } = useGroupContext();

  const expenses = group.expenses;

  console.log("Expenses", expenses);

  const [visibleCount, setVisibleCount] = React.useState(INITIAL_VISIBLE_COUNT);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const loadMoreTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  React.useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [group.id, filterKey]);

  React.useEffect(() => {
    return () => {
      if (loadMoreTimeout.current) clearTimeout(loadMoreTimeout.current);
    };
  }, []);

  const filteredExpenses = React.useMemo(
    () => filterAndSortExpenses(expenses ?? [], filterKey),
    [expenses, filterKey],
  );

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

  const renderGroup = ({ item: expense }: { item: any }) => {
    console.log("Item render group", expense);
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
            {expense.date}
          </CText>
          <View
            style={{ flex: 1, height: 1, backgroundColor: Colors.neutral[700] }}
          />
        </View>

        <View style={{ borderRadius: 10, gap: 10 }}>
          <Pressable
            key={`${expense.date}}`}
            onPress={() =>
              router.push({
                pathname: "/(stack)/groups/[groupId]/details",
                params: {
                  groupId: group.id,
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
            <ActivityItem item={expense} />
          </Pressable>
          ))
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={expenses}
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
        <RefreshControl
          refreshing={refreshing ?? false}
          onRefresh={handleRefresh}
          tintColor={Colors.neutral[200]}
          colors={[Colors.accent[400]]}
        />
      }
    />
  );
};

export default ExpenseTab;
