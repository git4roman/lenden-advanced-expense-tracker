import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG } from "@/api.config";

const BASE_URL = `${API_CONFIG.BASE_URL}/api/v1/`;

export const api = createApi({
  reducerPath: "api",
  baseQuery: async (args, apiApi, extraOptions) => {
    const rawBaseQuery = fetchBaseQuery({
      baseUrl: BASE_URL,
      prepareHeaders: async (headers) => {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      },
    });

    const result = await rawBaseQuery(args, apiApi, extraOptions);
    // console.log("RTK Query result:", JSON.stringify(result));
    return result;
  },

  endpoints: () => ({}),
});
