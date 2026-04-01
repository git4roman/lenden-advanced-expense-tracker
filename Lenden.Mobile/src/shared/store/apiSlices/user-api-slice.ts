import { setAuthCredentials } from "@/src/shared/store/slices/auth-slice";
import { api } from "@/src/shared/store/apiSlices/apiClient";
import { setUserInfo, UserInfoState } from "../slices/user-slice";

export type UpdateUserPayload = Partial<UserInfoState>;
export type UpdatePersonalInfoPayload = {
  id: string;
  data: Partial<UserInfoState>;
};

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query<UserInfoState, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: [{ type: "User", id: "ME" }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Slice:", data);
          dispatch(
            setUserInfo({
              givenName: data.givenName,
              familyName: data.familyName,
              username: data.username,
              email: data.email,
              phone: data.phone,
              memberSince: data.memberSince,
            }),
          );
        } catch (error) {
          console.log("Error From Auth Login", error);
        }
      },
    }),
    updateMe: builder.mutation<UserInfoState, UpdateUserPayload>({
      query: (payload) => ({
        url: "/users/me",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: [{ type: "User", id: "ME" }],
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const state = getState() as { userInfo: UserInfoState };
          const current = state.userInfo;
          dispatch(
            setUserInfo({
              givenName: data?.givenName ?? arg.givenName ?? current.givenName,
              familyName:
                data?.familyName ?? arg.familyName ?? current.familyName,
              username: data?.username ?? arg.username ?? current.username,
              email: data?.email ?? arg.email ?? current.email,
              phone: data?.phone ?? arg.phone ?? current.phone,
              memberSince: data?.memberSince ?? current.memberSince,
            }),
          );
        } catch (error) {
          console.log("Update user error", JSON.stringify(error, null, 2));
        }
      },
    }),
    updatePersonalInfo: builder.mutation<UserInfoState, UpdatePersonalInfoPayload>({
      query: ({ id, data }) => ({
        url: `/users/${id}/edit-personal-info`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "User", id: "ME" }],
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const state = getState() as { userInfo: UserInfoState };
          const current = state.userInfo;
          dispatch(
            setUserInfo({
              givenName: data?.givenName ?? arg.data.givenName ?? current.givenName,
              familyName:
                data?.familyName ?? arg.data.familyName ?? current.familyName,
              username: data?.username ?? arg.data.username ?? current.username,
              email: data?.email ?? arg.data.email ?? current.email,
              phone: data?.phone ?? arg.data.phone ?? current.phone,
              memberSince: data?.memberSince ?? current.memberSince,
            }),
          );
        } catch (error) {
          console.log("Update personal info error", JSON.stringify(error, null, 2));
        }
      },
    }),
  }),
});

export const { useMeQuery, useUpdateMeMutation, useUpdatePersonalInfoMutation } =
  userApi;
