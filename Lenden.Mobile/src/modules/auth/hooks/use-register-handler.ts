import { useState } from "react";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useRegisterMutation } from "@/src/shared/store/apiSlices/auth-slice.api";

export const useRegisterHandler = () => {
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("String123");
  const [firstName, setFirstName] = useState("Admin");
  const [lastName, setLastName] = useState("Admining");
  const [register, { isLoading }] = useRegisterMutation();
  const [ipAddress, setIPAddress] = useState("192.1.1.18");
  const [deviceInfo, setDeviceInfo] = useState("android");

  const handleRegister = async () => {
    try {
      const response = await register({
        email,
        password,
        ipAddress,
        deviceInfo,
        firstName,
        lastName,
      }).unwrap();
      Toast.show({ type: "success", text1: "Registeration Successful" });
      router.replace("/(tabs)/(home)");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Registeration Failed",
        text2: error?.data?.message ?? "Invalid Registration data",
      });
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    handleRegister,
    isLoading,
    deviceInfo,
    setDeviceInfo,
    ipAddress,
    setIPAddress,
  };
};
