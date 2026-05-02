import { Provider, useSelector } from "react-redux";
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
import GeneralBottomSheetScreen from "@/src/shared/ui/components/general-bottomSheet-screen";
import { BottomSheetProvider } from "@/src/shared/providers/BottomSheetProviders";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function RootNavigator() {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const isLoggedIn = Boolean(token);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(stack)" />
        </Stack.Protected>

        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>

      <GeneralBottomSheetScreen />
    </>
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <ThemeProvider>
              <BottomSheetProvider>
                <RootNavigator />
              </BottomSheetProvider>
              <Toast />
            </ThemeProvider>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
