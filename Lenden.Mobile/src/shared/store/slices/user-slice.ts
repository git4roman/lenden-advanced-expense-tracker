import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserInfoState = {
  userInfo: {
    firstName: string;
    lastName: string;
  } | null;
};

const initialState: UserInfoState = {
  userInfo: null,
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfoState>) => {
      state.userInfo = action.payload.userInfo ?? null;
    },
  },
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
