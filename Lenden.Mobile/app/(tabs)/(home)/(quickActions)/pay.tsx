import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";

const groups = ["Roommates", "Office Team", "Trip to Pokhara"];
const recipients = ["Roman", "Aayush", "Sita", "Nabin"];
const methods = ["Cash", "Bank Transfer", "eSewa", "Khalti"];

const Pay = () => {
  const [amount, setAmount] = useState("");
  const [group, setGroup] = useState(groups[0]);
  const [recipient, setRecipient] = useState(recipients[0]);
  const [method, setMethod] = useState(methods[0]);
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [notes, setNotes] = useState("");

  const hasEvidence = useMemo(() => evidenceUrl.trim().length > 0, [evidenceUrl]);

  const chipStyle = (active: boolean) => ({
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: active ? Colors.accent[500] : Colors.neutral[700],
    backgroundColor: active ? Colors.accent[900] : Colors.neutral[900],
  });

  const handleCancel = () => {
    router.back();
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
            Paid To
          </CText>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {recipients.map((item) => (
              <Pressable
                key={item}
                style={chipStyle(recipient === item)}
                onPress={() => setRecipient(item)}
              >
                <CText
                  size="sm"
                  color={recipient === item ? "accent" : "neutral"}
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
            Payment Method
          </CText>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {methods.map((item) => (
              <Pressable
                key={item}
                style={chipStyle(method === item)}
                onPress={() => setMethod(item)}
              >
                <CText
                  size="sm"
                  color={method === item ? "accent" : "neutral"}
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
            Payment Evidence
          </CText>
          {hasEvidence ? (
            <Image
              source={{ uri: evidenceUrl.trim() }}
              style={{
                width: "100%",
                height: 180,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: Colors.neutral[700],
                backgroundColor: Colors.neutral[800],
              }}
            />
          ) : (
            <View
              style={{
                height: 140,
                borderRadius: 14,
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: Colors.neutral[700],
                backgroundColor: Colors.neutral[800],
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 16,
              }}
            >
              <Ionicons
                name="image-outline"
                size={28}
                color={Colors.neutral[500]}
              />
              <CText size="sm" color="neutral" shade={500}>
                Add payment proof image
              </CText>
            </View>
          )}

          <TextInput
            value={evidenceUrl}
            onChangeText={setEvidenceUrl}
            placeholder="Paste evidence image URL"
            placeholderTextColor={Colors.neutral[600]}
            autoCapitalize="none"
            style={{
              backgroundColor: Colors.neutral[800],
              borderColor: Colors.neutral[700],
              borderWidth: 1,
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 12,
              color: Colors.neutral[100],
            }}
          />
          <CText size="xs" color="neutral" shade={500}>
            Camera/gallery picker can be connected here later.
          </CText>
        </View>

        <View style={{ gap: 8 }}>
          <CText weight="semibold" size="sm" color="neutral" shade={300}>
            Notes
          </CText>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Add note about this payment"
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

export default Pay;
