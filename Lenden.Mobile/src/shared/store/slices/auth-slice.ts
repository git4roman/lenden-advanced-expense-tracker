import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  sub: string; // slug
  email: string;
  role: string;
  jti: string;
  exp: number;
};

type User = {
  slug: string;
  email: string;
  role: string;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
};

const decodeToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      slug: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    return null;
  }
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
    setAuthCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = decodeToken(action.payload.accessToken); // 👈 decoded here
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

export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectAccessToken = (state: { auth: AuthState }) =>
  state.auth.accessToken;
