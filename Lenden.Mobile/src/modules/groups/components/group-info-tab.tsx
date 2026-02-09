import { View, Text, ScrollView, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { userProfilesData } from "@/app/(tabs)/(groups)/groups.mock";
import { Feather } from "@expo/vector-icons";

const GroupInfoTab = () => {
  const [text, setText] = useState("");
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        gap: 16,
        paddingHorizontal: 8,
        paddingBottom: 20,
      }}
    >
      <View style={{ gap: 8 }}>
        <View style={{ gap: 4 }}>
          <CText style={{ color: Colors.neutral[300] }} size="xs">
            Group Title
          </CText>
          <CText
            style={{ color: Colors.neutral[50] }}
            weight="medium"
            size="ssm"
          >
            Trip to Japan
          </CText>
        </View>
        <View style={{ gap: 4 }}>
          <CText style={{ color: Colors.neutral[300] }} size="xs">
            Description
          </CText>
          <CText
            style={{ color: Colors.neutral[50] }}
            weight="medium"
            size="ssm"
          >
            Vacationing with college friends in Japan
          </CText>
        </View>
        <View style={{ gap: 4 }}>
          <CText style={{ color: Colors.neutral[300] }} size="xs">
            Currency
          </CText>
          <CText
            style={{ color: Colors.neutral[50] }}
            weight="medium"
            size="ssm"
          >
            USD
          </CText>
        </View>
        <View style={{ gap: 4 }}>
          <CText style={{ color: Colors.neutral[300] }} size="xs">
            Category
          </CText>
          <CText
            style={{ color: Colors.neutral[50] }}
            weight="medium"
            size="ssm"
          >
            Trip ✈️
          </CText>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          height: 0.5,
          backgroundColor: Colors.neutral[700],
        }}
      />
      <View style={{ gap: 4 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CText weight="semibold" size="md" color="neutral" shade={100}>
            Group Members
          </CText>
          <Pressable
            style={{
              borderWidth: 1,
              borderColor: Colors.accent[500],
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <CText weight="semibold" size="sm" color="neutral" shade={100}>
              + Add
            </CText>
          </Pressable>
        </View>
        <View style={{ gap: 8 }}>
          {userProfilesData.map((item, index) => (
            <View
              key={item.id}
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 8,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  borderWidth: 1,
                  borderColor: Colors.neutral[400],
                  overflow: "hidden",
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  resizeMode="cover"
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <View>
                  <CText
                    color="neutral"
                    shade={300}
                    weight="semibold"
                    size="ssm"
                  >
                    {item.name}
                    {item.id === 1 ? " (You)" : ""}
                  </CText>
                  <CText color="neutral" shade={400}>
                    {item.email}
                  </CText>
                </View>
                <Feather
                  name="more-vertical"
                  size={24}
                  color={Colors.neutral[200]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default GroupInfoTab;
