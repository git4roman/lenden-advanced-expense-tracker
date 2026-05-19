import { API_CONFIG } from "@/api.config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Toast from "react-native-toast-message";
import { RootState } from "../store";

const BASE_URL = `${API_CONFIG.BASE_URL}/api/v1`;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,

  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQuery: typeof rawBaseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const error = result.error;

    if (error.status === "FETCH_ERROR") {
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Please check your internet connection",
      });
    }

    if (error.status === 500) {
      Toast.show({
        type: "error",
        text1: "Server Error",
        text2: "Something went wrong",
      });
    }

    if (error.status === 401) {
      Toast.show({
        type: "error",
        text1: "Unauthorized",
        text2: "Please login again",
      });
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Group", "User", "Expense", "Friend"],
  endpoints: () => ({}),
});
