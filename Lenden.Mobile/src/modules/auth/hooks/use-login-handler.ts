import { useLoginMutation } from "@/src/shared/store/apiSlices/auth-slice.api";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";

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
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.log(error);

      switch (error?.status) {
        case "FETCH_ERROR":
          return;

        case 401:
          Toast.show({
            type: "error",
            text1: "Unauthorized",
            text2: "Invalid credentials",
          });
          return;

        default:
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error?.data?.message ?? "Something went wrong",
          });
      }
    }
  };

  return { email, setEmail, password, setPassword, handleLogin, isLoading };
};
