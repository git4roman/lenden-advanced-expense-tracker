import { api } from "@/src/shared/store/apiSlices/apiClient";
import { setExpenses } from "../slices/expense-slice";

const expenseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query({
      query: (payload) => ({
        url: `/Expense/${payload}`,
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setExpenses({
              expenses: data.expenses,
            }),
          );
        } catch (error) {}
      },
    }),
    getExpense: builder.query({
      query: () => ({
        url: "/ExpenseApi",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setExpenses({
              expenses: data.expenses,
            }),
          );
        } catch (error) {}
      },
    }),
    createExpense: builder.mutation({
      query: (payload) => ({
        url: "/Expense",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setExpenses({
              expenses: data.expenses,
            }),
          );
        } catch (error) {}
      },
    }),

    deleteExpense: builder.mutation({
      query: (payload) => ({
        url: "/ExpenseApi",
        method: "DELETE",
        body: payload,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setExpenses({
              expenses: data.expenses,
            }),
          );
        } catch (error) {}
      },
    }),
  }),
});

export const {
  useCreateExpenseMutation,
  useGetExpensesQuery,
  useDeleteExpenseMutation,
  useGetExpenseQuery,
} = expenseApi;
