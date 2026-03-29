import { api } from "@/src/shared/store/apiSlices/apiClient";
import { setExpenses } from "../slices/expense-slice";

const expenseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query({
      query: (payload) => ({
        url: `/Expense/${payload}`,
        method: "GET",
      }),
      providesTags: (result, error, groupId) => {
        console.log("providesTags fired with groupId:", groupId);
        return [{ type: "Expense", id: groupId }];
      },
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
      providesTags: (result, error, id) => [{ type: "Expense", id }],
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
      invalidatesTags: (result, error, payload) => [
        { type: "Expense", id: payload.groupId },
      ],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setExpenses({
              expenses: data.expenses,
            }),
          );
        } catch (error) {
          console.log("The error from Create Expense");
        }
      },
    }),

    deleteExpense: builder.mutation({
      query: (payload) => ({
        url: "/ExpenseApi",
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: (result, error, payload) => [
        { type: "Expense", id: payload.groupId },
        { type: "Expense", id: payload.id },
      ],
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
