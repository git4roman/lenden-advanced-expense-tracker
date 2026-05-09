import { Settlements } from "@/src/modules/quickActions/settlement/types/settlement-slice.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Settlements[] = [];

const settlementsSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setSettlements: (state, action: PayloadAction<Settlements[]>) => {
      return action.payload;
    },
  },
});

export const { setSettlements } = settlementsSlice.actions;
export default settlementsSlice.reducer;
