import { store } from "@/src/shared/store/store";
import { Redirect } from "expo-router";

const index = () => {
  const token = store.getState().auth.accessToken;
  console.log("Token from the first page", token);

  return <Redirect href={token ? "/(tabs)/(home)" : "/(auth)/login"} />;
  // return <Redirect href={"/(tabs)/(home)"} />;
  // return null;
};

export default index;
