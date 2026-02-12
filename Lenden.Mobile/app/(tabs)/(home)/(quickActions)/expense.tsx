import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const groups = ["Roommates", "Office Team", "Trip to Pokhara"];
const categories = [
  "Food",
  "Transport",
  "Groceries",
  "Utilities",
  "Shopping",
  "Other",
];
const members = ["Roman", "Aayush", "Sita", "Nabin"];

const Expense = () => {
  const [amount, setAmount] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [paidBy, setPaidBy] = useState(members[0]);
  const [splitBetween, setSplitBetween] = useState<string[]>(members);
  const [notes, setNotes] = useState("");

  const perPersonAmount = useMemo(() => {
    const total = Number(amount || "0");
    if (!splitBetween.length || Number.isNaN(total)) return "0.00";
    return (total / splitBetween.length).toFixed(2);
  }, [amount, splitBetween.length]);

  const toggleSplitMember = (member: string) => {
    setSplitBetween((prev) => {
      if (prev.includes(member)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== member);
      }
      return [...prev, member];
    });
  };

  const chipStyle = (active: boolean) => ({
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: active ? Colors.accent[500] : Colors.neutral[700],
    backgroundColor: active ? Colors.accent[900] : Colors.neutral[900],
  });

  const handleSubmit = () => {
    console.log("Create Expense", {
      amount,
      selectedGroup,
      selectedCategory,
      paidBy,
      splitBetween,
      notes,
    });
  };

  const handleCancel = () => {
    router.back();
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
          Add Expense
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
            Group Selection
          </CText>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {groups.map((group) => (
              <Pressable
                key={group}
                style={chipStyle(selectedGroup === group)}
                onPress={() => setSelectedGroup(group)}
              >
                <CText
                  size="sm"
                  color={selectedGroup === group ? "accent" : "neutral"}
                  shade={selectedGroup === group ? 300 : 300}
                >
                  {group}
                </CText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <CText weight="semibold" size="sm" color="neutral" shade={300}>
            Category
          </CText>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {categories.map((category) => (
              <Pressable
                key={category}
                style={chipStyle(selectedCategory === category)}
                onPress={() => setSelectedCategory(category)}
              >
                <CText
                  size="sm"
                  color={selectedCategory === category ? "accent" : "neutral"}
                  shade={selectedCategory === category ? 300 : 300}
                >
                  {category}
                </CText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <CText weight="semibold" size="sm" color="neutral" shade={300}>
            Paid By
          </CText>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {members.map((member) => (
              <Pressable
                key={member}
                style={chipStyle(paidBy === member)}
                onPress={() => setPaidBy(member)}
              >
                <CText
                  size="sm"
                  color={paidBy === member ? "accent" : "neutral"}
                  shade={paidBy === member ? 300 : 300}
                >
                  {member}
                </CText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <CText weight="semibold" size="sm" color="neutral" shade={300}>
            Split Between
          </CText>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {members.map((member) => {
              const isSelected = splitBetween.includes(member);
              return (
                <Pressable
                  key={member}
                  style={chipStyle(isSelected)}
                  onPress={() => toggleSplitMember(member)}
                >
                  <CText
                    size="sm"
                    color={isSelected ? "accent" : "neutral"}
                    shade={isSelected ? 300 : 300}
                  >
                    {member}
                  </CText>
                </Pressable>
              );
            })}
          </View>
          <CText size="xs" color="neutral" shade={500}>
            Equal split: NPR {perPersonAmount} each
          </CText>
        </View>

        <View style={{ gap: 8 }}>
          <CText weight="semibold" size="sm" color="neutral" shade={300}>
            Notes
          </CText>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Add note about this expense"
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

export default Expense;
