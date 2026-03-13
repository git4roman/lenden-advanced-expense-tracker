import React, { useState } from "react";
import { Pressable, TextInput, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { useLoginHandler } from "@/src/modules/auth/hooks/use-login- handler-hook";

export default function LoginScreen() {
  const { email, setEmail, password, setPassword, handleLogin, isLoading } =
    useLoginHandler();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.neutral[900], padding: 20 }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          paddingVertical: 18,
        }}
      >
        <View style={{ gap: 24 }}>
          <View style={{ gap: 10 }}>
            <CText size="xlg" weight="extrabold" color="neutral" shade={100}>
              Welcome Back
            </CText>
            <CText size="sm" color="neutral" shade={400}>
              Sign in to continue using LenDen.
            </CText>
          </View>

          <View style={{ gap: 14 }}>
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
                placeholder="Enter password"
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
            onPress={handleLogin}
            style={{
              backgroundColor: Colors.accent[500],
              borderRadius: 12,
              paddingVertical: 13,
              alignItems: "center",
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <CText weight="bold" color="neutral" shade={900}>
                Login
              </CText>
            )}
          </Pressable>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: Colors.neutral[700],
              }}
            />
            <CText size="xs" color="neutral" shade={500}>
              or Continue with
            </CText>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: Colors.neutral[700],
              }}
            />
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

        <View
          style={{ flexDirection: "row", justifyContent: "center", gap: 6 }}
        >
          <CText size="sm" color="neutral" shade={400}>
            Don't have an account?
          </CText>
          <Pressable
            onPress={() => {
              router.push("/(auth)/register");
            }}
          >
            <CText size="sm" weight="bold" color="accent" shade={400}>
              Register
            </CText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
