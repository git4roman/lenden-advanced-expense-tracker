import React, { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";

const groups = ["Roommates", "Office Team", "Trip to Pokhara"];
const members = ["Roman", "Aayush", "Sita", "Nabin"];
const dueOptions = ["Today", "Tomorrow", "This Week", "Custom"];

const Request = () => {
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

  const [amount, setAmount] = useState("");
  const [group, setGroup] = useState(groups[0]);
  const [requestFrom, setRequestFrom] = useState(members[0]);
  const [dueDate, setDueDate] = useState(dueOptions[0]);
  const [notes, setNotes] = useState("");

  const chipStyle = (active: boolean) => ({
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: active ? Colors.accent[500] : Colors.neutral[700],
    backgroundColor: active ? Colors.accent[900] : Colors.neutral[900],
  });

  const handleCancel = () => {
    if (from === "groupDetails" && groupId) {
      router.replace({
        pathname: "/(tabs)/(groups)/[groupId]/details",
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

    router.replace("/(tabs)/(home)");
  };

  const handleSubmit = () => {
    console.log("Create Payment Request", {
      amount,
      group,
      requestFrom,
      dueDate,
      notes,
    });
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
          Request Payment
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
        <View style={{ gap: 8 }}>
          <CText weight="semibold" size="sm" color="neutral" shade={300}>
            Amount
          </CText>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
            placeholderTextColor={Colors.neutral[600]}
            style={{
              backgroundColor: Colors.neutral[800],
              borderColor: Colors.neutral[700],
              borderWidth: 1,
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 12,
              color: Colors.neutral[100],
              fontSize: 28,
            }}
          />
        </View>

        <View style={{ gap: 8 }}>
          <CText weight="semibold" size="sm" color="neutral" shade={300}>
            Group
          </CText>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {groups.map((item) => (
              <Pressable
                key={item}
                style={chipStyle(group === item)}
                onPress={() => setGroup(item)}
              >
                <CText
                  size="sm"
                  color={group === item ? "accent" : "neutral"}
                  shade={300}
                >
                  {item}
                </CText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <CText weight="semibold" size="sm" color="neutral" shade={300}>
            Request From
          </CText>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {members.map((item) => (
              <Pressable
                key={item}
                style={chipStyle(requestFrom === item)}
                onPress={() => setRequestFrom(item)}
              >
                <CText
                  size="sm"
                  color={requestFrom === item ? "accent" : "neutral"}
                  shade={300}
                >
                  {item}
                </CText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <CText weight="semibold" size="sm" color="neutral" shade={300}>
            Due Date
          </CText>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {dueOptions.map((item) => (
              <Pressable
                key={item}
                style={chipStyle(dueDate === item)}
                onPress={() => setDueDate(item)}
              >
                <CText
                  size="sm"
                  color={dueDate === item ? "accent" : "neutral"}
                  shade={300}
                >
                  {item}
                </CText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <CText weight="semibold" size="sm" color="neutral" shade={300}>
            Notes
          </CText>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Add note about this payment request"
            placeholderTextColor={Colors.neutral[600]}
            multiline
            textAlignVertical="top"
            style={{
              backgroundColor: Colors.neutral[800],
              borderColor: Colors.neutral[700],
              borderWidth: 1,
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 12,
              minHeight: 96,
              color: Colors.neutral[100],
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Request;
