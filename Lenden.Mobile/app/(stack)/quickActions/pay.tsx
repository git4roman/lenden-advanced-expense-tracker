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
  selectedGroupBalance: Transaction | null;
  selectedGroup: GroupSummaryResponse | null;
};

export interface RequestSettlementPayload {
  groupId: string;
  requestedBy: string;
  creditorId: string;
}

export const groupBalanceMock: Transaction[] = [
  {
    from: "Roman",
    fromUserId: "user_1",
    to: "Alex",
    toUserId: "user_2",
    amount: 4000,
  },
  {
    from: "Sarah",
    fromUserId: "user_3",
    to: "Roman",
    toUserId: "user_1",
    amount: 1800,
  },
  {
    from: "Emily",
    fromUserId: "user_4",
    to: "Alex",
    toUserId: "user_2",
    amount: 950,
  },
];

const Pay = () => {
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
    selectedGroup: null,
    groupBalances: [],
    selectedGroupBalance: null,
  });

  const fromData: RequestSettlementPayload = {
    groupId: paymentForm.selectedGroup?.id!,
    requestedBy: currentUser?.slug!,
    creditorId: paymentForm?.selectedGroupBalance?.toUserId!,
  };

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

  const handleSubmit = () => {
    console.log("Create Payment", {
      amount,
      group,
      recipient,
      method,
      evidenceUrl,
      notes,
    });
    resetForm();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: Colors.neutral[900],
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <CText weight="bold" size="xmd" color="neutral" shade={200}>
          Record Payment
        </CText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Pressable
            onPress={handleCancel}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              backgroundColor: Colors.neutral[800],
            }}
          >
            <CText size="sm" weight="semibold" color="neutral" shade={300}>
              Cancel
            </CText>
          </Pressable>
          <Pressable
            onPress={handleSubmit}
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              backgroundColor: Colors.accent[500],
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="checkmark" size={22} color={Colors.neutral[900]} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
      >
        <View style={{ gap: 8, padding: 12 }}>
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
              paddingVertical: 12,
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
            backgroundColor: Colors.neutral[800],
            gap: 12,
            paddingVertical: 12,
            paddingHorizontal: 8,
          }}
        >
          {groupBalanceMock
            ?.filter((item) => item.fromUserId === "user_1")
            ?.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  backgroundColor: Colors.neutral[900],
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: Colors.neutral[800],
                  gap: 12,
                }}
              >
                {/* Left Content */}
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
                    <CText weight="bold" size="xmd" color="neutral" shade={100}>
                      {item.from}
                    </CText>

                    <CText
                      weight="medium"
                      size="md"
                      color="neutral"
                      shade={400}
                    >
                      needs to pay
                    </CText>

                    <CText weight="bold" size="xmd" color="neutral" shade={100}>
                      {item.to}
                    </CText>
                  </View>

                  <CText
                    weight="semibold"
                    size="lg"
                    color="primary"
                    shade={400}
                  >
                    {item.amount}
                  </CText>
                </View>

                {/* Settlement Button */}
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
                  onPress={() => {
                    console.log("Request Settle");
                  }}
                >
                  <CText weight="bold" size="sm" color="neutral" shade={50}>
                    Settle
                  </CText>
                </Pressable>
              </View>
            ))}
          {groupBalanceMock
            ?.filter((item) => item.toUserId === "user_1")
            ?.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  backgroundColor: Colors.neutral[900],
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: Colors.neutral[800],
                  gap: 12,
                }}
              >
                {/* Left Content */}
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
                    <CText weight="bold" size="xmd" color="neutral" shade={100}>
                      {item.from}
                    </CText>

                    <CText
                      weight="medium"
                      size="md"
                      color="neutral"
                      shade={400}
                    >
                      needs to pay
                    </CText>

                    <CText weight="bold" size="xmd" color="neutral" shade={100}>
                      {item.to}
                    </CText>
                  </View>

                  <CText
                    weight="semibold"
                    size="lg"
                    color="primary"
                    shade={400}
                  >
                    {item.amount}
                  </CText>
                </View>

                {/* Settlement Button */}
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
                  onPress={() => {
                    console.log("Confirm Settle");
                  }}
                >
                  <CText weight="bold" size="sm" color="neutral" shade={50}>
                    Settle
                  </CText>
                </Pressable>
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Pay;
