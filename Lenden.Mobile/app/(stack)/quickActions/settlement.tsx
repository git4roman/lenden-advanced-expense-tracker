import { GroupSummaryResponse } from "@/src/modules/groups/types/group-slice.type";
import { useBottomSheet } from "@/src/shared/hooks/use-base-bottomSheet";
import { Transaction } from "@/src/shared/store/slices/group-slice";
import { RootState } from "@/src/shared/store/store";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const groups = ["Roommates", "Office Team", "Trip to Pokhara"];
const recipients = ["Roman", "Aayush", "Sita", "Nabin"];
const methods = ["Cash", "Bank Transfer", "eSewa", "Khalti"];

export type PaymentFormType = {
  groups: GroupSummaryResponse[];
  imageUrl: string;
  groupBalances: Transaction[];
  selectedGroup: GroupSummaryResponse | null;
};

export interface RequestSettlementPayload {
  groupId: string;
  requestedBy: string;
  creditorId: string;
}

// export const groupBalanceMock: Transaction[] = [
//   {
//     from: "Roman",
//     fromUserId: "user_1",
//     to: "Alex",
//     toUserId: "user_2",
//     amount: 4000,
//   },
//   {
//     from: "Sarah",
//     fromUserId: "user_3",
//     to: "Roman",
//     toUserId: "user_1",
//     amount: 1800,
//   },
//   {
//     from: "Emily",
//     fromUserId: "user_4",
//     to: "Alex",
//     toUserId: "user_2",
//     amount: 950,
//   },
// ];

const Settlement = () => {
  const {
    from,
    groupId,
    date,
    time,
    categoryKey,
    description,
    amount: sourceAmount,
  } = useLocalSearchParams<{
    from?: string;
    groupId?: string;
    date?: string;
    time?: string;
    categoryKey?: string;
    description?: string;
    amount?: string;
  }>();

  const { openSheet } = useBottomSheet();
  const groups: GroupSummaryResponse[] = useSelector(
    (state: RootState) => state.group,
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [paymentForm, setPaymentForm] = useState<PaymentFormType>({
    groups: [],
    imageUrl: "",
    selectedGroup: groups[0],
    groupBalances: [],
  });

  const hasEvidence = useMemo(
    () => evidenceUrl.trim().length > 0,
    [evidenceUrl],
  );

  const chipStyle = (active: boolean) => ({
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: active ? Colors.accent[500] : Colors.neutral[700],
    backgroundColor: active ? Colors.accent[900] : Colors.neutral[900],
  });

  const resetForm = () => {};

  const handleCancel = () => {
    resetForm();
    if (from === "groupDetails" && groupId) {
      router.replace({
        pathname: "/(stack)/groups/[groupId]/details",
        params: {
          groupId,
          date: date ?? "",
          time: time ?? "",
          categoryKey: categoryKey ?? "",
          description: description ?? "",
          amount: sourceAmount ?? "",
        },
      });
      return;
    }

    router.replace("/(tabs)/home");
  };

  const handleSubmit = (toUserId: string) => {
    const payload: RequestSettlementPayload = {
      groupId: paymentForm.selectedGroup?.id!,
      requestedBy: currentUser?.slug!,
      creditorId: toUserId,
    };
    console.log("Create Payment", payload);

    resetForm();
  };

  const payableBalances =
    paymentForm?.selectedGroup?.balances?.filter(
      (item) => item.fromUserId === currentUser?.slug,
    ) ?? [];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        // paddingHorizontal: 16,
        backgroundColor: Colors.neutral[900],
        gap: 24,
      }}
    >
      <View style={{ position: "relative", gap: 8 }}>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: -1,
            backgroundColor: Colors.neutral[850],
            height: 100,
            // width: "100%",
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderRadius: 12,
          }}
        >
          <Pressable
            onPress={handleCancel}
            style={{ flexDirection: "row", gap: 12 }}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.neutral[100]} />
            <CText weight="medium" size="md" color="neutral" shade={100}>
              Record Payment
            </CText>
          </Pressable>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Pressable
              onPress={handleCancel}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: Colors.neutral[700],
                backgroundColor: Colors.neutral[900],
              }}
            >
              <CText size="sm" weight="semibold" color="neutral" shade={300}>
                Cancel
              </CText>
            </Pressable>
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              backgroundColor: Colors.primary[900],
              borderRadius: 16,
              padding: 16,
              gap: 8,
              borderWidth: 1,
              borderColor: Colors.primary[700],
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ionicons
                name="information-circle"
                size={18}
                color={Colors.primary[300]}
              />

              <CText weight="bold" size="md" color="primary" shade={300}>
                Settlement Payments
              </CText>
            </View>

            <CText size="sm" color="neutral" shade={400}>
              Review outstanding balances in this group and record payments
              after settlement is completed.
            </CText>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 24,
          paddingBottom: 24,
          paddingHorizontal: 16,
        }}
      >
        <View style={{ gap: 8 }}>
          <Pressable
            onPress={() =>
              openSheet(
                "selectGroup",
                (group: GroupSummaryResponse) => {
                  setPaymentForm((prev) => ({
                    ...prev,
                    selectedGroup: group,
                  }));
                },
                paymentForm.selectedGroup,
                2,
              )
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 14,
              paddingVertical: 18,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: Colors.accent[500],
              backgroundColor: Colors.accent[900],
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons
                name="people-outline"
                size={16}
                color={Colors.accent[400]}
              />
              <CText size="md" weight="semibold" color="accent" shade={300}>
                {paymentForm?.selectedGroup?.name ?? "Select Group"}
              </CText>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <CText size="xs" color="neutral" shade={500}>
                {paymentForm?.selectedGroup?.members?.length ?? 0} members
              </CText>
              <Ionicons
                name="chevron-down"
                size={14}
                color={Colors.neutral[500]}
              />
            </View>
          </Pressable>
        </View>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 16,
            borderColor: Colors.neutral[700],
            backgroundColor: Colors.neutral[850],
            gap: 12,
            paddingVertical: 12,
            paddingHorizontal: 14,
          }}
        >
          <View>
            <CText size="md" weight="medium" color="neutral" shade={100}>
              Pending Payments
            </CText>
          </View>
          {payableBalances.length === 0 ? (
            <View
              style={{
                paddingVertical: 32,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CText weight="semibold" size="md" color="neutral" shade={400}>
                Nobody to pay
              </CText>
            </View>
          ) : (
            payableBalances.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderRadius: 14,
                  backgroundColor: Colors.neutral[900],
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: Colors.neutral[800],
                  gap: 12,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    gap: 4,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <CText
                      weight="semibold"
                      size="ssm"
                      color="neutral"
                      shade={100}
                    >
                      {item.from}
                    </CText>

                    <CText
                      weight="medium"
                      size="ssm"
                      color="neutral"
                      shade={400}
                    >
                      needs to pay
                    </CText>

                    <CText
                      weight="semibold"
                      size="ssm"
                      color="neutral"
                      shade={100}
                    >
                      {item.to}
                    </CText>
                  </View>

                  <CText
                    weight="semibold"
                    size="xmd"
                    color="primary"
                    shade={400}
                  >
                    Rs. {item.amount}
                  </CText>
                </View>

                <Pressable
                  style={({ pressed }) => ({
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 14,
                    backgroundColor: pressed
                      ? Colors.primary[700]
                      : Colors.primary[600],
                    opacity: pressed ? 0.9 : 1,
                  })}
                  onPress={() => handleSubmit(item.toUserId)}
                >
                  <CText weight="bold" size="sm" color="neutral" shade={50}>
                    Pay
                  </CText>
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settlement;
