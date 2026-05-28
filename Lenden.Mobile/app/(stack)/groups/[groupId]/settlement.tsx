import { CText, useTheme } from "@/src/shared";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

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
  All = "all",
  Pending = "pending",
  Completed = "completed",
}

const GroupSettlements = () => {
  const { Colors } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const filteredSettlements = groupSettlementsMockData.filter((item) => {
    if (activeTab === "all") return true;
    return item.status.toLowerCase() === activeTab;
  });

  return (
    <View>
      <Text>GroupSettlements</Text>

      <View style={{ justifyContent: "space-around", alignItems: "center" }}>
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
                      {isCompleted ? "Paid" : "needs to pay"}
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
  );
};

export default GroupSettlements;
