import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { onLogout } from "@/src/modules/auth/helpers/google-auth.service";

import {
  formatDate,
  getInitials,
  logout,
  RootState,
  useMeQuery,
} from "@/src/shared";

export const useAccount = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isRateModalVisible, setIsRateModalVisible] = useState(false);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const userInfo = useSelector((state: RootState) => state.userInfo);

  const { refetch, isFetching } = useMeQuery(undefined, {
    skip: !accessToken,
  });

  const infoRows = useMemo(
    () => ({
      fullName:
        `${userInfo?.givenName ?? ""} ${userInfo?.familyName ?? ""}`.trim() ||
        "-",

      username: userInfo?.username || "-",
      phone: userInfo?.phone || "-",
      email: userInfo?.email || "-",

      memberSince: userInfo?.memberSince
        ? formatDate(userInfo.memberSince, {
            month: "long",
            year: "numeric",
          })
        : "-",

      initials: getInitials(
        `${userInfo?.givenName ?? ""} ${userInfo?.familyName ?? ""}`,
      ),
    }),
    [userInfo],
  );

  const handleLogout = async () => {
    setIsLogoutModalVisible(false);

    await onLogout();

    dispatch(logout());

    router.replace("/(auth)/login");
  };

  return {
    userInfo,
    infoRows,

    isFetching,
    refetch,

    isLogoutModalVisible,
    setIsLogoutModalVisible,

    isRateModalVisible,
    setIsRateModalVisible,

    handleLogout,
  };
};
