import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  View,
  Image,
  RefreshControl,
} from "react-native";
import ChervonRight from "@/assets/icons/chevron-right.png";
import InfoIcon from "@/assets/icons/info.png";
import LockIcon from "@/assets/icons/lock.png";
// import BellICon from "@/assets/icons/bell.png";
// import SettingIcon from "@/assets/icons/settings.png";
// import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
// import StarIcon from "@/assets/icons/star.png";
import UserIcon from "@/assets/icons/user.png";
import { CText } from "@/src/shared/ui/components/CText";

import { Colors } from "@/src/shared/ui/theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { logout } from "@/src/shared/store/slices/auth-slice";
import { clearAuth } from "@/src/shared/services/storage/auth-storage";
import { RootState } from "@/src/shared/store/store";
import { formatDate } from "@/src/shared/utils/format-date.utils";
import { getInitials } from "@/src/shared/utils/get-initials.utils";
import { onLogout } from "@/src/shared/services/auth/google-auth.service";
import { useMeQuery } from "@/src/shared/store/apiSlices/user-api-slice";

type AcccountItems = {
  title: string;
  icon: ImageSourcePropType;
  path: Href;
};

const accountItems: AcccountItems[] = [
  {
    title: "Personal Information",
    icon: UserIcon,
    path: "/(stack)/account/personalinfo",
  },
  // { title: "Payment details", icon: CreditCardIcon, path: "/paymentDetails" },
  { title: "Security", icon: LockIcon, path: "/(stack)/account/security" },
];

type SettingItemProps = {
  leftIcon?: ImageSourcePropType;
  title: string;
  rightIcon: ImageSourcePropType;
  onPress: () => void;
  rightExtraContent?: string;
  variant?: "default" | "danger";
};

export function DividedPattern({
  leftIcon,
  title,
  rightIcon,
  onPress,
  rightExtraContent,
  variant,
}: SettingItemProps) {
  const isDanger = variant === "danger";
  const textColor = isDanger ? Colors.warning[300] : Colors.neutral[200];

  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 38,
      }}
      onPress={onPress}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        {leftIcon && (
          <Image
            source={leftIcon}
            style={{ width: 18, height: 18, tintColor: textColor }}
          />
        )}
        <CText size="sm" color={textColor} weight="semibold">
          {title}
        </CText>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        {rightExtraContent && (
          <CText size="sm" color={Colors.neutral[400]} weight="semibold">
            {rightExtraContent}
          </CText>
        )}
        <Image
          source={rightIcon}
          style={{ width: 16, height: 16, tintColor: Colors.neutral[400] }}
        />
      </View>
    </Pressable>
  );
}

export default function Account() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isRateModalVisible, setIsRateModalVisible] = useState(false);

  const { refetch, isFetching } = useMeQuery(undefined, {
    skip: !useSelector((state: RootState) => state.auth.accessToken),
  });

  const userInfo = useSelector((state: RootState) => state.userInfo);

  const infoRows = {
    fullName: `${userInfo.givenName} ${userInfo.familyName}` || "-",
    username: userInfo.username || "-",
    phone: userInfo.phone || "-",
    memberSince: userInfo.memberSince
      ? formatDate(userInfo.memberSince, { month: "long", year: "numeric" })
      : "-",
    email: userInfo.email || "-",
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: Colors.neutral[950], flex: 1 }}
      edges={["top"]}
    >
      {userInfo === null ? (
        <View
          style={{
            flex: 1,
            marginVertical: 250,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <CText shade={200} size="xxlg">
            Please{" "}
          </CText>
          <Pressable
            style={{
              backgroundColor: Colors.primary[500],
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 12,
            }}
            onPress={() => router.push("/(auth)/login")}
          >
            <CText shade={800} size="xmd" weight="semibold">
              {" "}
              Login
            </CText>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1 }}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              tintColor={Colors.neutral[200]}
              colors={[Colors.accent[400]]}
            />
          }
        >
          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 20,
              backgroundColor: Colors.neutral[950],
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                gap: 12,
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderRadius: 12,
                backgroundColor: Colors.neutral[800],
                borderWidth: 1,
                borderColor: Colors.neutral[700],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  padding: 1,
                  borderRadius: 32,
                  backgroundColor: Colors.accent[900],
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CText size="sm" color="accent" shade={300} weight="bold">
                  {getInitials(infoRows.fullName)}
                </CText>
              </View>
              <CText size="sm" color={Colors.neutral[100]} weight="bold">
                {infoRows.fullName}
              </CText>
              <Pressable
                onPress={() => router.push("/(stack)/account/notification")}
              >
                <CText size="sm" color={Colors.neutral[400]}>
                  Member Since {infoRows.memberSince}
                </CText>
              </Pressable>
            </View>

            <View
              style={{
                marginTop: 24,
                flexDirection: "column",
                gap: 24,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <CText size="ssm" color={Colors.neutral[300]} weight="bold">
                  Account
                </CText>
                <View
                  style={{
                    flexDirection: "column",
                    gap: 4,
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderRadius: 12,
                    backgroundColor: Colors.neutral[800],
                    borderWidth: 1,
                    borderColor: Colors.neutral[700],
                  }}
                >
                  {accountItems.map((item) => (
                    <DividedPattern
                      key={item.title}
                      leftIcon={item.icon}
                      title={item.title}
                      rightIcon={ChervonRight}
                      onPress={() => router.push(item.path)}
                    />
                  ))}
                </View>
              </View>
              
                  
              {/* <View
                style={{
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <CText size="ssm" color={Colors.neutral[300]} weight="bold">
                  Preferences
                </CText>
                <View
                  style={{
                    flexDirection: "column",
                    gap: 4,
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderRadius: 12,
                    backgroundColor: Colors.neutral[800],
                    borderWidth: 1,
                    borderColor: Colors.neutral[700],
                  }}
                >
                  <DividedPattern
                    leftIcon={BellICon}
                    title="Notification"
                    rightIcon={ChervonRight}
                    onPress={() => router.push("/(stack)/account/notification")}
                  />
                  <DividedPattern
                    leftIcon={SettingIcon}
                    title="Settings"
                    rightIcon={ChervonRight}
                    onPress={() => router.push("/(stack)/account/settings")}
                  />
                </View>
              </View> */}

              <View
                style={{
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <CText size="sm" color={Colors.neutral[300]} weight="bold">
                  Support
                </CText>
                <View
                  style={{
                    flexDirection: "column",
                    gap: 4,
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderRadius: 12,
                    backgroundColor: Colors.neutral[800],
                    borderWidth: 1,
                    borderColor: Colors.neutral[700],
                  }}
                >
                  {/* <DividedPattern
                    leftIcon={StarIcon}
                    title="Rate the App"
                    rightIcon={ChervonRight}
                    onPress={() => setIsRateModalVisible(true)}
                  /> */}
                  <DividedPattern
                    leftIcon={InfoIcon}
                    title="About App"
                    rightIcon={ChervonRight}
                    onPress={() => router.push("/(stack)/account/about")}
                  />
                  <DividedPattern
                    leftIcon={InfoIcon}
                    title="Logout"
                    rightIcon={ChervonRight}
                    onPress={() => setIsLogoutModalVisible(true)}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      <Modal
        transparent
        animationType="fade"
        visible={isLogoutModalVisible}
        onRequestClose={() => setIsLogoutModalVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => setIsLogoutModalVisible(false)}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          />

          <View
            style={{
              marginHorizontal: 20,
              marginTop: "75%",
              borderRadius: 14,
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              backgroundColor: Colors.neutral[800],
              padding: 16,
              gap: 16,
            }}
          >
            <View style={{ gap: 6 }}>
              <CText size="md" color={Colors.neutral[100]} weight="bold">
                Logout
              </CText>
              <CText size="sm" color={Colors.neutral[400]}>
                Are you sure you want to logout?
              </CText>
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={() => setIsLogoutModalVisible(false)}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: Colors.neutral[600],
                  backgroundColor: Colors.neutral[900],
                  borderRadius: 10,
                  paddingVertical: 10,
                  alignItems: "center",
                }}
              >
                <CText color="neutral" shade={300} weight="semibold">
                  Cancel
                </CText>
              </Pressable>

              <Pressable
                onPress={() => {
                  setIsLogoutModalVisible(false);
                  console.log("I am clicked");
                  onLogout();
                  dispatch(logout());
                  clearAuth();
                  router.replace("/(auth)/login");
                }}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  paddingVertical: 10,
                  alignItems: "center",
                  backgroundColor: Colors.warning[500],
                }}
              >
                <CText color="neutral" shade={900} weight="bold">
                  Logout
                </CText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={isRateModalVisible}
        onRequestClose={() => setIsRateModalVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => setIsRateModalVisible(false)}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          />

          <View
            style={{
              marginHorizontal: 20,
              marginTop: "75%",
              borderRadius: 14,
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              backgroundColor: Colors.neutral[800],
              padding: 16,
              gap: 16,
            }}
          >
            <View style={{ gap: 6 }}>
              <CText size="md" color={Colors.neutral[100]} weight="bold">
                Rate LenDen
              </CText>
              <CText size="sm" color={Colors.neutral[400]}>
                Enjoying the app? Please rate us in the store.
              </CText>
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={() => setIsRateModalVisible(false)}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: Colors.neutral[600],
                  backgroundColor: Colors.neutral[900],
                  borderRadius: 10,
                  paddingVertical: 10,
                  alignItems: "center",
                }}
              >
                <CText color="neutral" shade={300} weight="semibold">
                  Maybe Later
                </CText>
              </Pressable>

              <Pressable
                onPress={() => {
                  setIsRateModalVisible(false);
                  console.log("rate-app");
                }}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  paddingVertical: 10,
                  alignItems: "center",
                  backgroundColor: Colors.accent[500],
                }}
              >
                <CText color="neutral" shade={900} weight="bold">
                  Rate Now
                </CText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
