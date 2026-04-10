import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";

const groups = ["All Groups", "Roommates", "Office Team", "Trip to Pokhara"];
const periods = ["This Month", "Last Month", "Last 3 Months", "Custom"];
const formats = ["PDF", "CSV"];
const includeOptions = ["Expenses", "Payments", "Requests", "Settlements"];

const Statement = () => {
  const { from, groupId } = useLocalSearchParams<{
    from?: string;
    groupId?: string;
  }>();
  const [group, setGroup] = useState(groups[0]);
  const [period, setPeriod] = useState(periods[0]);
  const [format, setFormat] = useState(formats[0]);
  const [include, setInclude] = useState<string[]>([
    "Expenses",
    "Payments",
    "Requests",
  ]);
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const chipStyle = (active: boolean) => ({
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: active ? Colors.accent[500] : Colors.neutral[700],
    backgroundColor: active ? Colors.accent[900] : Colors.neutral[900],
  });

  const toggleInclude = (value: string) => {
    setInclude((prev) => {
      if (prev.includes(value)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== value);
      }
      return [...prev, value];
    });
  };

  const previewLine = useMemo(() => {
    return `${period} - ${group} - ${format}`;
  }, [period, group, format]);

  const handleCancel = () => {
    if (from === "groupDetails" && groupId) {
      router.replace({
        pathname: "/(tabs)/(groups)/[groupId]",
        params: { groupId },
      });
      return;
    }

    router.replace("/(tabs)/(home)");
  };

  const handleGenerate = () => {
    console.log("Generate Statement", {
      group,
      period,
      format,
      include,
      email,
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
          Generate Statement
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
            onPress={handleGenerate}
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
            Period
          </CText>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {periods.map((item) => (
              <Pressable
                key={item}
                style={chipStyle(period === item)}
                onPress={() => setPeriod(item)}
              >
                <CText
                  size="sm"
                  color={period === item ? "accent" : "neutral"}
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
            Format
          </CText>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {formats.map((item) => (
              <Pressable
                key={item}
                style={chipStyle(format === item)}
                onPress={() => setFormat(item)}
              >
                <CText
                  size="sm"
                  color={format === item ? "accent" : "neutral"}
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
            Include
          </CText>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {includeOptions.map((item) => {
              const isSelected = include.includes(item);
              return (
                <Pressable
                  key={item}
                  style={chipStyle(isSelected)}
                  onPress={() => toggleInclude(item)}
                >
                  <CText
                    size="sm"
                    color={isSelected ? "accent" : "neutral"}
                    shade={300}
                  >
                    {item}
                  </CText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <CText weight="semibold" size="sm" color="neutral" shade={300}>
            Send To Email (optional)
          </CText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            placeholderTextColor={Colors.neutral[600]}
            autoCapitalize="none"
            keyboardType="email-address"
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
        </View>

        <View style={{ gap: 8 }}>
          <CText weight="semibold" size="sm" color="neutral" shade={300}>
            Notes
          </CText>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Any extra detail for this statement"
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

        <View
          style={{
            borderWidth: 1,
            borderColor: Colors.neutral[700],
            backgroundColor: Colors.neutral[800],
            borderRadius: 14,
            padding: 12,
            gap: 4,
          }}
        >
          <CText weight="semibold" size="sm" color="neutral" shade={300}>
            Preview
          </CText>
          <CText size="sm" color="neutral" shade={400}>
            {previewLine}
          </CText>
          <CText size="xs" color="neutral" shade={500}>
            {include.length} sections selected
          </CText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Statement;
