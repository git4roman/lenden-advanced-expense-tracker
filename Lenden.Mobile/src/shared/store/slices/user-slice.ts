import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserInfoState = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  memberSince: string;
};

const initialState: UserInfoState = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  phone: "",
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
