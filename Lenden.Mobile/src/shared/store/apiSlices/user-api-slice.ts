import { setAuthCredentials } from "@/src/shared/store/slices/auth-slice";
import { api } from "@/src/shared/store/apiSlices/apiClient";
import { setUserInfo, UserInfoState } from "../slices/user-slice";
import { RootState } from "../store";

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
              imgUrl: data.imgUrl,
              username: data.username,
              email: data.email,
              phoneNumber: data.phoneNumber,
              memberSince: data.memberSince,
            }),
          );
        } catch (error) {
          console.log("Error From Auth Login", error);
        }
      },
    }),

    updatePersonalInfo: builder.mutation<
      UserInfoState,
      UpdatePersonalInfoPayload
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}/edit`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "User", id: "ME" }],
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const state = getState() as RootState;

          const current = state.userInfo;
          dispatch(
            setUserInfo({
              givenName:
                data?.givenName ?? arg.data.givenName ?? current.givenName,
              familyName:
                data?.familyName ?? arg.data.familyName ?? current.familyName,
              username: data?.username ?? arg.data.username ?? current.username,
              email: data?.email ?? arg.data.email ?? current.email,
              phoneNumber: data?.phoneNumber ?? arg.data.phoneNumber ?? current.phoneNumber,
              memberSince: data?.memberSince ?? current.memberSince,
              imgUrl: data?.imgUrl ?? current.imgUrl,
            }),
          );
        } catch (error) {
          console.log(
            "Update personal info error",
            JSON.stringify(error, null, 2),
          );
        }
      },
    }),
  }),
});

export const {
  useMeQuery,

  useUpdatePersonalInfoMutation,
} = userApi;
