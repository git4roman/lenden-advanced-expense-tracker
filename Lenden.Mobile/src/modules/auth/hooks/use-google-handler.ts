import { useGoogleMutation } from "@/src/shared/store/apiSlices/auth-slice.api";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { onGoogleButtonPress } from "../helpers";

export const useGoogleHandler = () => {
  const [google, { isLoading }] = useGoogleMutation();

  const handleGoogle = async () => {
    const firebaseToken = await onGoogleButtonPress();

    console.log("Handle Google data", firebaseToken);

    const payload = {
      idToken: firebaseToken,
      deviceInfo: "Android",
      ipAddress: "192.168.1.0",
    };

    console.log("Payload", payload);

    try {
      const response = await google(payload).unwrap();
      Toast.show({ type: "success", text1: "Login Successful" });
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.log("Error from login", error);
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error?.data?.message ?? "Invalid credentials",
      });
    }
  };

  return { handleGoogle, isLoading };
};
