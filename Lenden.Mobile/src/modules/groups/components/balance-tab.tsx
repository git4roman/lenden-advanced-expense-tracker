import { RootState } from "@/src/shared/store/store";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { FlatList, Pressable, ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { useMembers } from "../hooks/use-member";
import { useGroupContext } from "../providers";
import { Repayment } from "../types";
import { BalanceItem } from "./balance-tab/BalanceItem";

const BalanceTab = () => {
  const { group } = useGroupContext();
  const { repayments, members, id } = group;
  const { getMember } = useMembers(members);
  const maxAmount =
    repayments?.length > 0
      ? Math.max(...repayments.map((repayment) => repayment.amount))
      : 0;
  console.log("maxAmount", maxAmount);

  // const maxAmount = 2000;

  const currentUser = useSelector((state: RootState) => state.userInfo);

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
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      <Pressable
        onPress={() => {
          router.push(`/(stack)/groups/${id}/settlement`);
        }}
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          flexDirection: "row",
          gap: 4,
        }}
      >
        <MaterialIcons name={"payments"} size={24} color={Colors.accent[500]} />
        <CText weight="bold" size="md" color="primary" shade={500}>
          Settlements
        </CText>
      </Pressable>
      <View style={{ gap: 12, paddingBottom: 20 }}>
        {repayments?.length === 0 ? (
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
            data={repayments}
            renderItem={({ item }) => (
              <BalanceItem
                item={item}
                maxBalance={maxAmount}
                user={currentUser}
                getMember={getMember}
              />
            )}
            contentContainerStyle={{
              gap: 10,
              borderWidth: 1,
              borderRadius: 12,
              paddingVertical: 12,
              backgroundColor: Colors.neutral[900],
              borderColor: Colors.neutral[800],
            }}
            keyExtractor={(item) => `${item.from}-${item.to}`}
            scrollEnabled={false}
          />
        )}
        <FlatList
          keyExtractor={(_, index) => index.toString()}
          data={repayments ?? []}
          renderItem={({ item }) => (
            <GroupMemberMutualBalance
              item={item}
              handleSettlement={handleSettlement}
              user={currentUser}
              getMember={getMember}
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

function GroupMemberMutualBalance({
  item,
  handleSettlement,
  user,
  getMember,
}: {
  item: Repayment;
  handleSettlement: (type: string) => void;
  user: any;
  getMember: (id: string) => {
    givenName: string;
    familyName: string;
    avatar: string;
  };
}) {
  const isUserDebtor = user.id === item.from;
  const isUserCreditor = user.id === item.to;
  const fromUser = getMember(item.from);
  const toUser = getMember(item.to);
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
            <CText color="neutral" shade={300} weight="medium" size="md">
              {fromUser.givenName} {fromUser.familyName}
            </CText>
          </View>
          <CText color="neutral" shade={500} weight="regular" size="ssm">
            owes
          </CText>
          <View>
            <CText color="neutral" shade={300} weight="medium" size="md">
              {toUser.givenName} {toUser.familyName}
            </CText>
          </View>
        </View>

        {/* <View style={{ flex: 0.2 }} /> */}

        <View
          style={{
            alignItems: "center",
            gap: 8,
            flexDirection: "row-reverse",
            // flex: 1,
            // borderWidth: 1,
            // maxWidth: 200,
          }}
        >
          <View>
            <CText color="accent" shade={300} weight="bold" size="md">
              NPR {item.amount}
            </CText>
          </View>
          {(isUserCreditor || isUserDebtor) && (
            <Pressable
              onPress={() =>
                handleSettlement(isUserCreditor ? "creditor" : "debtor")
              }
              style={{
                borderWidth: 1,
                borderColor: Colors.accent[300],
                padding: 8,
                borderRadius: 8,
                backgroundColor: Colors.primary[900],
                // flex: 1,
              }}
            >
              <CText color="neutral" shade={200}>
                {isUserCreditor ? "Make Settlement" : "Request Settlement"}
              </CText>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
