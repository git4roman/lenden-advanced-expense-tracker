import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserInfoState = {
  givenName: string;
  familyName: string;
  imgUrl: string;
  username: string;
  email: string;
  phoneNumber: string;
  memberSince: string;
};

const initialState: UserInfoState = {
  givenName: "",
  familyName: "",
  imgUrl: "",
  username: "",
  email: "",
  phoneNumber: "",
  memberSince: "",
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfoState>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
