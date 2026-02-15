import React, { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.neutral[900], padding: 20 }}
    >
      <View style={{ flex: 1, justifyContent: "space-between", paddingVertical: 18 }}>
        <View style={{ gap: 24 }}>
          <View style={{ gap: 10 }}>
            <CText size="xlg" weight="extrabold" color="neutral" shade={100}>
              Create Account
            </CText>
            <CText size="sm" color="neutral" shade={400}>
              Join LenDen and start managing shared expenses.
            </CText>
          </View>

          <View style={{ gap: 14 }}>
            <View style={{ gap: 6 }}>
              <CText size="xs" color="neutral" shade={500}>
                Full Name
              </CText>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your full name"
                placeholderTextColor={Colors.neutral[600]}
                style={{
                  borderWidth: 1,
                  borderColor: Colors.neutral[700],
                  backgroundColor: Colors.neutral[800],
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: Colors.neutral[100],
                }}
              />
            </View>

            <View style={{ gap: 6 }}>
              <CText size="xs" color="neutral" shade={500}>
                Email
              </CText>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={Colors.neutral[600]}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  borderWidth: 1,
                  borderColor: Colors.neutral[700],
                  backgroundColor: Colors.neutral[800],
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: Colors.neutral[100],
                }}
              />
            </View>

            <View style={{ gap: 6 }}>
              <CText size="xs" color="neutral" shade={500}>
                Password
              </CText>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create password"
                placeholderTextColor={Colors.neutral[600]}
                secureTextEntry
                style={{
                  borderWidth: 1,
                  borderColor: Colors.neutral[700],
                  backgroundColor: Colors.neutral[800],
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: Colors.neutral[100],
                }}
              />
            </View>
          </View>

          <Pressable
            onPress={() => {
              router.replace("/(tabs)/(home)");
            }}
            style={{
              backgroundColor: Colors.accent[500],
              borderRadius: 12,
              paddingVertical: 13,
              alignItems: "center",
            }}
          >
            <CText weight="bold" color="neutral" shade={900}>
              Register
            </CText>
          </Pressable>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <View style={{ flex: 1, height: 1, backgroundColor: Colors.neutral[700] }} />
            <CText size="xs" color="neutral" shade={500}>
              or Continue with
            </CText>
            <View style={{ flex: 1, height: 1, backgroundColor: Colors.neutral[700] }} />
          </View>

          <Pressable
            onPress={() => {
              router.replace("/(tabs)/(home)");
            }}
            style={{
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              borderRadius: 12,
              paddingVertical: 13,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 8,
              backgroundColor: Colors.neutral[800],
            }}
          >
            <FontAwesome name="google" size={16} color={Colors.neutral[100]} />
            <CText weight="semibold" color="neutral" shade={100}>
              Continue with Google
            </CText>
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", gap: 6 }}>
          <CText size="sm" color="neutral" shade={400}>
            Already have an account?
          </CText>
          <Pressable
            onPress={() => {
              router.push("/(auth)/login");
            }}
          >
            <CText size="sm" weight="bold" color="accent" shade={400}>
              Login
            </CText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
