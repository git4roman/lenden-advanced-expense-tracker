import { View, Text } from "react-native";
import React from "react";
import { Redirect } from "expo-router";

const quickAction = () => {
  return <Redirect href="/(stack)/quickActions/expense" />;
};

export default quickAction;
