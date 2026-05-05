import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserInfoState = {
  address: string;
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  imageUrl: string;
  memberSince: string;
  phoneNumber: string;
  username: string;
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
