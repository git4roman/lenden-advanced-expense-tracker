import React from "react";
import { Redirect } from "expo-router";
import { store } from "@/src/shared/store/store";

const index = () => {
  const token = store.getState().auth.token;
  console.log("Token from the first page", token);
  console.log("Token from the first page", token);

  return <Redirect href={token ? "/(tabs)/(home)" : "/(auth)/login"} />;
  // return <Redirect href={"/(tabs)/(home)"} />;
};

export default index;
