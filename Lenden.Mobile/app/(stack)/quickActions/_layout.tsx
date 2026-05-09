import { Slot } from "expo-router";
import React from "react";

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
