import {
  ConfirmSettlementRequest,
  RequestSettlementRequest,
  SettlementRequest,
  Settlements,
} from "@/src/modules/quickActions/settlement/types/settlement-slice.type";
import { api } from "@/src/shared/store/apiSlices/apiClient";
import { setSettlements } from "../slices/settlement-slice";

const settlementApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSettlements: builder.query<Settlements[], SettlementRequest>({
      query: () => ({
        url: "/settlements",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setSettlements(data));
        } catch (error) {
          console.log("Error From Auth Login", error);
        }
      },
    }),
    confirmSettlement: builder.mutation<void, ConfirmSettlementRequest>({
      query: ({ groupId, settlementId }) => ({
        url: `/settlements/${groupId}/confirm`,
        method: "POST",
        body: { settlementId },
      }),
    }),
    requestSettlement: builder.mutation<void, RequestSettlementRequest>({
      query: ({ groupId, requestedBy, creditorId }) => {
        console.log("Hitting URL:", `/settlements/${groupId}/request`);
        return {
          url: `/settlements/${groupId}/request`,
          method: "POST",
          body: { groupId, requestedBy, creditorId },
        };
      },
    }),
    settleSettlement: builder.mutation<void, SettlementRequest>({
      query: ({ groupId, requestedBy, debtorId }) => ({
        url: `/${groupId}/request`,
        method: "POST",
        body: {
          groupId,
          requestedBy,
          debtorId,
        },
      }),
    }),
  }),
});

export const {
  useGetSettlementsQuery,
  useRequestSettlementMutation,
  useConfirmSettlementMutation,
  useSettleSettlementMutation,
} = settlementApi;
