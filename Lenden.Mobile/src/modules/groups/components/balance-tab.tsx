import {
  useGetGroupBalanceQuery,
  useGetGroupQuery,
} from "@/src/shared/store/apiSlices/group-slice.api";
import { Transaction } from "@/src/shared/store/slices/group-slice";
import { RootState } from "@/src/shared/store/store";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import React from "react";
import { FlatList, Pressable, ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

const BalanceTab = ({ groupId }: { groupId: string }) => {
  const { data: group, isLoading: isGroupLoading } = useGetGroupQuery(groupId);
  const { data: mutualBalances } = useGetGroupBalanceQuery(groupId);
  const balanceItems = (group?.members ?? []).map((member: any) => ({
    user: member,
    balance: member.netBalance ?? 0,
  }));
  const maxBalance =
    Math.max(
      1,
      ...balanceItems
        .map((b: any) => Math.abs(Number(b.balance) || 0))
        .filter((v: any) => Number.isFinite(v)),
    ) || 1;

  const currentUser = useSelector((state: RootState) => state.auth.user);

  const handleSettlement = (type: string) => {
    console.log("Type", type);

    try {
      if (type === "creditor") {
        //make settlement
      } else {
        //request settlement
      }

      Toast.show({
        type: "success",
        text1: `Settlement ${type === "creditor" ? "Requested" : "Made"}`,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "error",
      });
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ gap: 12, paddingBottom: 20 }}>
        {balanceItems.length === 0 && !isGroupLoading ? (
          <View
            style={{
              borderWidth: 1,
              borderRadius: 12,
              paddingVertical: 16,
              backgroundColor: Colors.neutral[900],
              borderColor: Colors.neutral[800],
              alignItems: "center",
            }}
          >
            <CText size="sm" color="neutral" shade={400}>
              No member balances yet.
            </CText>
          </View>
        ) : (
          <FlatList
            data={balanceItems}
            renderItem={({ item }) => (
              <BalanceItem item={item} maxBalance={maxBalance} />
            )}
            contentContainerStyle={{
              gap: 10,
              borderWidth: 1,
              borderRadius: 12,
              paddingVertical: 12,
              backgroundColor: Colors.neutral[900],
              borderColor: Colors.neutral[800],
            }}
            keyExtractor={(item) => item.user.id?.toString() ?? item.user.email}
            scrollEnabled={false}
          />
        )}
        <FlatList
          keyExtractor={(_, index) => index.toString()}
          data={mutualBalances ?? []}
          renderItem={({ item }) => (
            <GroupMemberMutualBalance
              item={item}
              handleSettlement={handleSettlement}
              currentUserId={currentUser?.slug ?? ""}
            />
          )}
          contentContainerStyle={{
            gap: 10,
            borderWidth: 1,
            borderRadius: 12,
            paddingVertical: 10,
            backgroundColor: Colors.neutral[900],
            borderColor: Colors.neutral[800],
            paddingHorizontal: 8,
          }}
          scrollEnabled={false}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: Colors.neutral[600],
                marginVertical: 4,
                opacity: 0.3,
              }}
            />
          )}
        />
      </View>
    </ScrollView>
  );
};

export default BalanceTab;

function BalanceItem({ item, maxBalance }: { item: any; maxBalance: any }) {
  const isPositive = item.balance > 0;
  const absBalance = Math.abs(item.balance);
  const minWidth = 55;
  const maxWidth = 90;
  const widthPercent =
    absBalance === 0
      ? minWidth
      : Math.floor(
          Math.max(
            minWidth,
            Math.min(maxWidth, (absBalance / maxBalance) * maxWidth),
          ),
        );

  return (
    <View style={{ flexDirection: isPositive ? "row" : "row-reverse" }}>
      <View style={{ flex: 1, padding: 8 }}>
        <View style={{ alignItems: isPositive ? "flex-end" : "stretch" }}>
          <CText shade={50} size="sm" letterSpacing={0.4}>
            {item.user.givenName} {item.user.familyName}
          </CText>
        </View>
      </View>
      <View
        style={{ flex: 1, alignItems: isPositive ? "flex-start" : "flex-end" }}
      >
        <View
          style={{
            width: `${widthPercent}%`,
            backgroundColor:
              absBalance === 0
                ? Colors.neutral[700]
                : isPositive
                  ? "green"
                  : "red",
            padding: 8,
            borderTopRightRadius: isPositive ? 8 : 0,
            borderBottomRightRadius: isPositive ? 8 : 0,
            borderTopLeftRadius: isPositive ? 0 : 8,
            borderBottomLeftRadius: isPositive ? 0 : 8,
            alignItems: isPositive ? "stretch" : "flex-end",
          }}
        >
          <CText shade={50} size="sm" letterSpacing={0.4}>
            {absBalance === 0
              ? `NPR ${absBalance} `
              : isPositive
                ? `+ NPR ${absBalance} `
                : `- NPR ${absBalance} `}
          </CText>
        </View>
      </View>
    </View>
  );
}

function GroupMemberMutualBalance({
  item,
  currentUserId,
  handleSettlement,
}: {
  item: Transaction;
  currentUserId: string;
  handleSettlement: (type: string) => void;
}) {
  const isUserDebtor = currentUserId === item.fromUserId;
  const isUserCreditor = currentUserId === item.toUserId;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        borderRadius: 12,
        backgroundColor: Colors.neutral[800],
        paddingVertical: 8,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
          paddingHorizontal: 12,
        }}
      >
        <View style={{ gap: 2 }}>
          <View>
            <CText color="neutral" shade={300} weight="semibold" size="md">
              {item.from}
            </CText>
          </View>
          <CText color="neutral" shade={500} weight="regular" size="ssm">
            owes
          </CText>
          <View>
            <CText color="neutral" shade={300} weight="semibold" size="md">
              {item.to}
            </CText>
          </View>
        </View>

        {(isUserCreditor || isUserDebtor) && (
          <Pressable
            onPress={() =>
              handleSettlement(isUserCreditor ? "creditor" : "debtor")
            }
          >
            <CText>
              {isUserCreditor ? "Make Settlement" : "Request Settlement"}
            </CText>
          </Pressable>
        )}
        <View style={{ alignItems: "flex-end", gap: 2 }}>
          <CText color="accent" shade={300} weight="bold" size="md">
            NPR {item.amount}
          </CText>
        </View>
      </View>
    </View>
  );
}
