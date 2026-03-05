import { api } from "../base-api";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payload) => ({
        url: "/AuthenticationApi/login",
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

export const { useLoginMutation, useRegisterMutation } = authApi;
