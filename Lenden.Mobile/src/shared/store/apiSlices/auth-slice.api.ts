import { setAuthCredentials } from "@/src/shared/store/slices/auth-slice";
import { api } from "@/src/shared/store/apiSlices/apiClient";
import { saveAuth } from "../../services/storage/auth-storage";
import {
  GoogleRequest,
  GoogleResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/src/modules/auth/types/auth-slice.type";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (payload) => ({
        url: "/auth/login",
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
              expiresAt: data.expiresAt.toISOString(),
            }),
          );
          // await saveAuth(data.accessToken, null, data.expiresAt.toISOString());
        } catch (error) {
          console.log("Error From Auth Login", error);
        }
      },
    }),
    google: builder.mutation<GoogleResponse, GoogleRequest>({
      query: (payload) => ({
        url: "/auth/google",
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
              expiresAt: data.expiresAt.toISOString(),
            }),
          );
          // await saveAuth(data.accessToken, null, data.expiresAt.toISOString());
        } catch (error) {
          console.log("Error From Auth Login", error);
        }
      },
    }),

    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (payload) => ({
        url: "/Auth/register",
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
              expiresAt: data.expiresAt.toISOString(),
            }),
          );
          // await saveAuth(data.accessToken, null, data.expiresAt.toISOString());
        } catch (error) {}
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGoogleMutation } =
  authApi;
