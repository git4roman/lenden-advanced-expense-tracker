import { GroupExpense } from "@/src/modules/groups/types/expense-slice.type";
import { IGroup } from "@/src/modules/groups/types/group-slice.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GroupWithExpenses extends IGroup {
  expenses?: GroupExpense[];
}

const initialState: GroupWithExpenses[] = [];

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setUserGroups: (state, action: PayloadAction<IGroup[]>) => {
      return action.payload;
    },
    setGroupExpenses: (
      state,
      action: PayloadAction<{ groupId: string; expenses: GroupExpense[] }>,
    ) => {
      const group = state.find((g) => g.id === action.payload.groupId);
      if (group) {
        group.expenses = action.payload.expenses;
      }
    },
  },
});

export const { setUserGroups, setGroupExpenses } = groupSlice.actions;
export default groupSlice.reducer;
