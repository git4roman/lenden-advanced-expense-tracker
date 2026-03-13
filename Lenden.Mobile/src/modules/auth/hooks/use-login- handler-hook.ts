// features/auth/hooks/useLoginHandler.ts
import { useState } from "react";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useLoginMutation } from "@/src/modules/auth/services/api/auth-api";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/src/shared/store/slices/auth-slice";

export const useLoginHandler = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const response = await login({ email, password }).unwrap();     
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
