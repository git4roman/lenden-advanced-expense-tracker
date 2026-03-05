import { api } from "../base-api";

const expenseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createExpense: builder.mutation({
      query: (payload) => ({
        url: "ExpenseApi",
        method: "POST",
        payload,
      }),
    }),
    register: builder.mutation({
      query: (payload) => ({
        url: "AuthenticationApi/register",
        method: "POST",
        payload,
      }),
    }),
  }),
});

export const { useCreateExpenseMutation, useRegisterMutation } = expenseApi;
