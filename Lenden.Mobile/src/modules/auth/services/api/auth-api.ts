import { setCredentials } from "@/src/shared/store/slices/auth-slice";
import { api } from "@/src/shared/services/api/client";

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
            setCredentials({
              token: data.token,
              user: data.user,
            }),
          );
        } catch {}
      },
    }),

    register: builder.mutation({
      query: (payload) => ({
        url: "/AuthenticationApi/register",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
