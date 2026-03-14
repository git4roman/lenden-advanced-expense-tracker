import { setAuthCredentials } from "@/src/shared/store/slices/auth-slice";
import { api } from "@/src/shared/store/apiSlices/apiClient";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payload) => ({
        url: "/AuthenticationApi/login",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setAuthCredentials({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              user: data.user,
            }),
          );
        } catch (error) {}
      },
    }),

    register: builder.mutation({
      query: (payload) => ({
        url: "/AuthenticationApi/register",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setAuthCredentials({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              user: data.user,
            }),
          );
        } catch (error) {}
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
