import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ExpenseParticipants = {
  firstName: string;
  paidAmount: number;
  splitAmount: number;
  netAmount: number;
};
type Expense = {
  groupId: number;
  expenseParticipants: ExpenseParticipants[];
  createdDate: string;
  updatedDate: string;
  amount: number;
  createdById: number;
};

type ExpenseState = {
  expenses: Expense[] | null;
};

const initialState: ExpenseState = {
  expenses: null,
};

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    setExpenses: (state, action: PayloadAction<ExpenseState>) => {
      state.expenses = action.payload.expenses ?? null;
    },
  },
});

export const { setExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
