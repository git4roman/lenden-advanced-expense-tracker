import { CText, useTheme } from "@/src/shared";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const groupSettlementsMockData = [
  {
    settlementId: "3a18a079-e6cf-4907-880c-e9084d35439c",
    groupId: "2bb0ceca-81f8-4494-9f50-3b2630550ec7",
    creditorId: "79ba90ba-e90c-40d0-b77f-fb029e2f73c2",
    creditorName: "Helmet String",
    debtorId: "d5cf0778-991c-4dcc-b072-957cc554ac83",
    debtorName: "DebtorName",
    amount: 8963.0,
    status: "Completed",
    createdAt: "0001-01-01T00:00:00+00:00",
  },
  {
    settlementId: "3a18a079-e6cf-4907-880c-e9084d35439c",
    groupId: "2bb0ceca-81f8-4494-9f50-3b2630550ec7",
    creditorId: "79ba90ba-e90c-40d0-b77f-fb029e2f73c2",
    creditorName: "Helmet String",
    debtorId: "d5cf0778-991c-4dcc-b072-957cc554ac83",
    debtorName: "DebtorName",
    amount: 8963.0,
    status: "Pending",
    createdAt: "0001-01-01T00:00:00+00:00",
  },
];

const tabOptions = [
  {
    key: "all",
    label: "All",
  },
  {
    key: "pending",
    label: "Pending",
  },
  {
    key: "completed",
    label: "Completed",
  },
] as const;

type TabKey = (typeof tabOptions)[number]["key"];

export enum TabKeyEnum {
  All = "All",
  Pending = "Pending",
  Completed = "Completed",
}

const GroupSettlements = () => {
  const { Colors } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const filteredSettlements = groupSettlementsMockData.filter((item) => {
    if (activeTab === "all") return true;
    return item.status.toLowerCase() === activeTab;
  });

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: Colors.neutral[900],
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
            backgroundColor: Colors.neutral[800],
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
            onPress={() => {}}
            style={{ flexDirection: "row", gap: 12 }}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.neutral[100]} />
            <CText weight="medium" size="md" color="neutral" shade={100}>
              Group Settlement
            </CText>
          </Pressable>
          {/* <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Pressable
              onPress={() => {}}
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
          </View> */}
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

      <View
        style={{
          backgroundColor: Colors.neutral[900],
          gap: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
        }}
      >
        <CText size="md" weight="medium" color="neutral" shade={100}>
          Group Settlements
        </CText>

        <View
          style={{
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {tabOptions.map((item, index) => (
            <Pressable
              onPress={() => {
                setActiveTab(item.key);
              }}
              style={[
                {
                  paddingHorizontal: 8,
                  paddingVertical: 6,
                },
                activeTab === item.key && {
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.neutral[200],
                },
              ]}
            >
              <CText weight="semibold" size="sm" color="neutral" shade={400}>
                {item.label}
              </CText>
            </Pressable>
          ))}
        </View>

        <View>
          {filteredSettlements.length === 0 ? (
            <View
              style={{
                paddingVertical: 32,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CText weight="semibold" size="md" color="neutral" shade={400}>
                No Settlements
              </CText>
            </View>
          ) : (
            filteredSettlements.map((item, index) => {
              const isCompleted = item.status === TabKeyEnum.Completed;
              console.log("Index", item.status);
              return (
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
                        {item.creditorName}
                      </CText>

                      <CText
                        weight="medium"
                        size="ssm"
                        color="neutral"
                        shade={400}
                      >
                        {isCompleted ? "paid" : "needs to pay"}
                      </CText>

                      <CText
                        weight="semibold"
                        size="ssm"
                        color="neutral"
                        shade={100}
                      >
                        {item.debtorName}
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

                  {!isCompleted && (
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
                      onPress={() => {}}
                    >
                      <CText weight="bold" size="sm" color="neutral" shade={50}>
                        Pay
                      </CText>
                    </Pressable>
                  )}
                </View>
              );
            })
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GroupSettlements;
