import { LogoutService } from "@/src/modules/auth";
import { RootState, useMeQuery } from "@/src/shared";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

export function useAuthBootstrap() {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const { isLoading, isError, error } = useMeQuery(undefined, { skip: !token });

  useEffect(() => {
    if (!isError || !error) return;
    const status = (error as any)?.status;
    if (status === 401) {
      Toast.show({ type: "error", text1: "Session Expired" });
      LogoutService();
    } else {
      Toast.show({ type: "error", text1: "Server Error" });
    }
  }, [isError]);

  return { token, isLoading };
}
