import { Href, useRouter } from "expo-router";
import {
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  Image,
} from "react-native";
import { useDispatch } from "react-redux";
import BellICon from "@/assets/icons/bell.png";
import ChervonRight from "@/assets/icons/chevron-right.png";
import CreditCardIcon from "@/assets/icons/credit-card.png";
import InfoIcon from "@/assets/icons/info.png";
import LockIcon from "@/assets/icons/lock.png";
import SettingIcon from "@/assets/icons/settings.png";
import StarIcon from "@/assets/icons/star.png";
import UserIcon from "@/assets/icons/user.png";
import { CText } from "@/src/shared/ui/components/CText";

import { ReactNode } from "react";
import { Colors } from "@/src/shared/ui/theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";

type AcccountItems = {
  title: string;
  icon: ImageSourcePropType;
  path: Href;
};

const accountItems: AcccountItems[] = [
  { title: "Personal Information", icon: UserIcon, path: "/personalinfo" },
  // { title: "Payment details", icon: CreditCardIcon, path: "/paymentDetails" },
  { title: "Security", icon: LockIcon, path: "/security" },
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
  const textColor = isDanger ? Colors.warning[200] : Colors.neutral[800];

  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
          <CText size="sm" color={Colors.neutral[200]} weight="semibold">
            {rightExtraContent}
          </CText>
        )}
        <Image
          source={rightIcon}
          style={{ width: 16, height: 16, tintColor: Colors.neutral[200] }}
        />
      </View>
    </Pressable>
  );
}

export default function Account() {
  const router = useRouter();

  return (
    <SafeAreaView
      style={{ backgroundColor: Colors.neutral[900], flex: 1 }}
      edges={["top"]}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1 }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 20,
            backgroundColor: Colors.neutral[900],
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
              backgroundColor: Colors.neutral[200],
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
                backgroundColor: "#000",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CText size="sm" color="pure-white" weight="bold">
                Hello
              </CText>
            </View>
            <CText size="sm" color={Colors.neutral[800]} weight="bold">
              Some Name
            </CText>
            <Pressable onPress={() => router.push("/notificationyes")}>
              <CText size="sm" color={Colors.neutral[800]}>
                Member since November 2025
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
                gap: 12,
              }}
            >
              <CText size="ssm" color={Colors.neutral[200]} weight="bold">
                Account
              </CText>
              <View
                style={{
                  flexDirection: "column",
                  gap: 24,
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  backgroundColor: Colors.neutral[200],
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

            <View
              style={{
                flexDirection: "column",
                gap: 12,
              }}
            >
              <CText size="ssm" color={Colors.neutral[200]} weight="bold">
                Preferences
              </CText>
              <View
                style={{
                  flexDirection: "column",
                  gap: 24,
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  backgroundColor: Colors.neutral[200],
                }}
              >
                <DividedPattern
                  leftIcon={BellICon}
                  title="Notification"
                  rightIcon={ChervonRight}
                  onPress={() => router.push("/notification")}
                />
                <DividedPattern
                  leftIcon={SettingIcon}
                  title="Settings"
                  rightIcon={ChervonRight}
                  onPress={() => router.push("/settings")}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "column",
                gap: 12,
              }}
            >
              <CText size="sm" color={Colors.neutral[200]} weight="bold">
                Support
              </CText>
              <View
                style={{
                  flexDirection: "column",
                  gap: 24,
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  backgroundColor: Colors.neutral[200],
                }}
              >
                <DividedPattern
                  leftIcon={StarIcon}
                  title="Rate the App"
                  rightIcon={ChervonRight}
                  onPress={() => {}}
                />
                <DividedPattern
                  leftIcon={InfoIcon}
                  title="About App"
                  rightIcon={ChervonRight}
                  onPress={() => router.push("/about")}
                />
                <DividedPattern
                  leftIcon={InfoIcon}
                  title="Logout"
                  rightIcon={ChervonRight}
                  onPress={() => {}}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
