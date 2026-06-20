// group-context.tsx
import { GroupWithExpenses } from "@/src/shared";
import { createContext, useContext } from "react";

type GroupContextValue = {
  group: GroupWithExpenses;
  isLoading: boolean;
  handleRefresh: () => void;
};

const GroupContext = createContext<GroupContextValue | null>(null);

export const GroupProvider = ({
  value,
  children,
}: {
  value: GroupContextValue;
  children: React.ReactNode;
}) => <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;

export const useGroupContext = () => {
  const ctx = useContext(GroupContext);
  if (!ctx)
    throw new Error("useGroupContext must be used within GroupProvider");
  return ctx;
};
