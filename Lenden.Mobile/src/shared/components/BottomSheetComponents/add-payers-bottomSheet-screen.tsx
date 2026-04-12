import { View, Pressable, ScrollView, TextInput, FlatList } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";
import { useBottomSheet } from "@/src/shared/hooks/use-base-bottomSheet";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

type PaymentMode = "equal" | "unequal";

type User = {
  userId: string;
  userName: string;
  paidAmount: number;
  splitAmount: number;
};

const users: User[] = [
  {
    userId: "39485hekkdfgd",
    userName: "roman#1",
    paidAmount: 200,
    splitAmount: 300,
  },
  {
    userId: "39485hekkdfgd",
    userName: "bhrastachar",
    paidAmount: 200,
    splitAmount: 300,
  },
  {
    userId: "39485hekkdfgd",
    userName: "lee ken yu1",
    paidAmount: 200,
    splitAmount: 300,
  },
  {
    userId: "39485hekkdfgd",
    userName: "british",
    paidAmount: 200,
    splitAmount: 300,
  },
  {
    userId: "39485hekkdfgd",
    userName: "british",
    paidAmount: 200,
    splitAmount: 300,
  },
  {
    userId: "39485hekkdfgd",
    userName: "british",
    paidAmount: 200,
    splitAmount: 300,
  },
];

const AddPayersBottomSheetScreen = () => {
  const { currentValue, selectValue, closeSheet } = useBottomSheet();

  return (
    <View
      style={{
        backgroundColor: Colors.neutral[900],
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 16,
        paddingBottom: 24,
      }}
    >
      <View>
        <CText color="neutral" shade={300} size="lg" weight="bold">
          Add payers
        </CText>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          // borderWidth: 1,
          // borderColor: Colors.neutral[400],
          // borderRadius: 8,
          padding: 6,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 14 }}>
          {users.map((item, index) => (
            <View
              key={index}
              style={{
                gap: 2,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <CText size="xmd" color="neutral" shade={50}>
                {item.userName}
              </CText>
              <CText size="xmd" color="neutral" shade={50}>
                {item.paidAmount}
              </CText>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          onPress={closeSheet}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: Colors.neutral[600],
            padding: 10,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <CText shade={300}>Cancel</CText>
        </Pressable>

        <Pressable
          style={{
            flex: 1,
            backgroundColor: Colors.accent[500],
            padding: 10,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <CText weight="bold">Save</CText>
        </Pressable>
      </View>
    </View>
  );
};

export default AddPayersBottomSheetScreen;
