import { formatDateTime } from "@/src/shared";
import { ActivityData, GroupedActivity } from "../components";

export const toActivityData = (expense: any): ActivityData => {
  const { date, time } = formatDateTime(expense.createdAt);
  const payers = expense?.participants?.filter((p: any) => p.paid > 0) ?? [];
  return {
    date,
    time,
    categoryKey: expense.categoryKey ?? "other",
    description: buildDescription(payers, expense.categoryKey),
    cost: expense.cost?.toString() ?? "0",
  };
};

export const groupByDate = (items: ActivityData[]): GroupedActivity[] => {
  const map = new Map<string, ActivityData[]>();
  for (const item of items) {
    const existing = map.get(item.date) ?? [];
    existing.push(item);
    map.set(item.date, existing);
  }
  return Array.from(map.entries()).map(([date, items]) => ({ date, items }));
};

export const buildDescription = (
  payers: any[],
  categoryKey: string,
): string => {
  const names = payers.map((p) => p.givenName);
  if (names.length === 0) return `Expense added for ${categoryKey}`;
  if (names.length === 1) return `${names[0]} paid for ${categoryKey}`;
  if (names.length === 2)
    return `${names[0]} and ${names[1]} paid for ${categoryKey}`;
  const last = names[names.length - 1];
  const rest = names.slice(0, -1).join(", ");
  return `${rest}, and ${last} paid for ${categoryKey}`;
};
