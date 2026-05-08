import {
  GroupBalanceResponse,
  GroupSummaryResponse,
} from "@/src/modules/groups/types/group-slice.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// type MutualBalanceUser = {
//   userId: number;
//   fullName: string;
// };
// type MutualBalanceData = {
//   fromUserId: number;
//   fromUser: MutualBalanceUser;
//   toUserId: number;
//   toUser: MutualBalanceUser;
//   amount: number;
// };
export type Member = {
  id: string;
  email: string;
  givenName: string;
  familyName: string;
  netBalance?: number;
};

export type Group = {
  id: string;
  name: string;
  imageUrl: string;
  members: Member[];
  updatedAt?: string;
  createdBy?: number;
  // mutualBalanceData: MutualBalanceData[];
  transaction: Transaction[];
};

export type GroupState = {
  groups: Group[] | null;
};

export type Transaction = {
  from: string;
  fromUserId: string;
  to: string;
  toUserId: string;
  amount: number;
};

const initialState: GroupSummaryResponse[] = [];

type SetGroupBalancePayload = {
  groupId: string;
  transactions: GroupBalanceResponse[];
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setUserGroups: (state, action: PayloadAction<GroupSummaryResponse[]>) => {
      return action.payload;
    },
    setGroupBalance: (state, action: PayloadAction<SetGroupBalancePayload>) => {
      const { groupId, transactions } = action.payload;
      const group = state.groups?.find((g) => g.id === groupId);
      if (group) {
        group.transaction = transactions;
      }
    },
  },
});

export const { setUserGroups, setGroupBalance } = groupSlice.actions;
export default groupSlice.reducer;
