import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Friend = {
  id: string;
  givenName: string;
  familyName: string;
  email: string;
};

type FriendsState = {
  friends: Friend[];
};

const initialState: FriendsState = {
  friends: [],
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<Friend[]>) => {
      state.friends = action.payload ?? [];
    },
    clearFriends: (state) => {
      state.friends = [];
    },
  },
});

export const { setFriends, clearFriends } = friendsSlice.actions;
export default friendsSlice.reducer;
