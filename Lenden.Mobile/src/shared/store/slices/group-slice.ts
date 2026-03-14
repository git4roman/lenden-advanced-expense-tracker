import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MutualBalanceUser = {
  userId: number;
  fullName: string;
};
type MutualBalanceData = {
  fromUserId: number;
  fromUser: MutualBalanceUser;
  toUserId: number;
  toUser: MutualBalanceUser;
  amount: number;
};
type Member = {
  firstName: string;
  imageUrl: string;
};
type Group = {
  name: string;
  imageUrl: string;
  updatedAt: string;
  members: Member[];
  createdBy: number;
  mutualBalanceData: MutualBalanceData[];
};
type GroupState = {
  groups: Group[] | null;
};

const initialState: GroupState = {
  groups: null,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setUserGroups: (state, action: PayloadAction<GroupState>) => {
      state.groups = action.payload.groups ?? null;
    },
  },
});

export const { setUserGroups } = groupSlice.actions;
export default groupSlice.reducer;
