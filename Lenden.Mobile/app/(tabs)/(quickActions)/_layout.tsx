import React from "react";
import { Slot, Stack } from "expo-router";

const QuickActionsLayout = () => {
  return (
    // <Stack screenOptions={{ headerShown: false }}>
    //   <Stack.Screen name="expense" />
    //   <Stack.Screen name="pay" />
    //   <Stack.Screen name="request" />
    //   <Stack.Screen name="statement" />
    // </Stack>
    <Slot />
  );
};

export default QuickActionsLayout;
