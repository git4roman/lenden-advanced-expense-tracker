import { useState } from "react";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useLoginMutation } from "@/src/shared/store/apiSlices/auth-slice.api";

export const useLoginHandler = () => {
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("String123");
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    try {
      const response = await login({
        email,
        password,
        ipAddress: "192.168.1.1",
        deviceInfo: "android",
      }).unwrap();
      Toast.show({ type: "success", text1: "Login Successful" });
      router.replace("/(tabs)/(home)");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error?.data?.message ?? "Invalid credentials",
      });
    }
  };

  return { email, setEmail, password, setPassword, handleLogin, isLoading };
};
