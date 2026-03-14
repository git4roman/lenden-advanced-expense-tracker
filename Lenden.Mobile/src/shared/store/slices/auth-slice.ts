import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthCredentials: (state, action: PayloadAction<AuthState>) => {
      state.accessToken = action.payload.accessToken ?? null;
      state.refreshToken = action.payload.refreshToken ?? null;
      state.user = action.payload.user ?? null;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
  },
});

export const { setAuthCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
