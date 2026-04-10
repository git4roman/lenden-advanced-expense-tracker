// app/_layout.tsx
import { Provider, useDispatch, useSelector } from "react-redux";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";

import {
  Urbanist_400Regular,
  Urbanist_400Regular_Italic,
  Urbanist_500Medium,
  Urbanist_500Medium_Italic,
  Urbanist_600SemiBold,
  Urbanist_600SemiBold_Italic,
  Urbanist_700Bold,
  Urbanist_700Bold_Italic,
  Urbanist_800ExtraBold,
  Urbanist_800ExtraBold_Italic,
  Urbanist_900Black,
  Urbanist_900Black_Italic,
} from "@expo-google-fonts/urbanist";
import { ThemeProvider } from "@/src/shared/providers/ThemeProviders";
import { persistor, store, RootState } from "@/src/shared/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect, useState } from "react";
import { useMeQuery } from "@/src/shared/store/apiSlices/user-api-slice";
import { logout } from "@/src/shared/store/slices/auth-slice";
import { LogoutService } from "@/src/shared/services/auth/logout.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

function AppBootstrap({ children }: { children: React.ReactNode }) {
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const { isLoading, isError, error, data } = useMeQuery(undefined, {
    skip: !token,
  });
  console.log("Layout:", data);

  // useEffect(() => {
  //   AsyncStorage.clear().then(() => console.log("AsyncStorage cleared"));
  // }, []);

  useEffect(() => {
    if (!isError || !error) return;

    const status = (error as any)?.status;

    if (status === 401) {
      Toast.show({
        type: "error",
        text1: "Session Expired",
        text2: "Please log in again.",
      });
      LogoutService();
    } else {
      // 500 or other — don't logout, just warn
      Toast.show({
        type: "error",
        text1: "Server Error",
        text2: "Something went wrong. Please try again later.",
      });
      // LogoutService();
    }
  }, [isError]);
  if (token && isLoading) return null;

  return <>{children}</>;
}

function RootNavigator() {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const user = useSelector((state: RootState) => state.userInfo);
  const isLoggedIn = Boolean(token && user?.email);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(stack)" />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_400Regular_Italic,
    Urbanist_500Medium,
    Urbanist_500Medium_Italic,
    Urbanist_600SemiBold,
    Urbanist_600SemiBold_Italic,
    Urbanist_700Bold,
    Urbanist_700Bold_Italic,
    Urbanist_800ExtraBold,
    Urbanist_800ExtraBold_Italic,
    Urbanist_900Black,
    Urbanist_900Black_Italic,
  });

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <ThemeProvider>
            <AppBootstrap>
              <RootNavigator />
            </AppBootstrap>
            <Toast />
          </ThemeProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
