import { useSelector } from "react-redux";
import { RootState } from "@/src/shared/store/store";
import { Redirect } from "expo-router";

const Index = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);

  if (token === undefined) return null;
  return <Redirect href={token ? "/(tabs)/home" : "/(auth)/login"} />;
};

export default Index;
