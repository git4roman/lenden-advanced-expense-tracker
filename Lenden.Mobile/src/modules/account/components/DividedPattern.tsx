import { CText, ThemeColors } from "@/src/shared";
import { Image, ImageSourcePropType, Pressable, View } from "react-native";

type SettingItemProps = {
  Colors: ThemeColors;
  leftIcon?: ImageSourcePropType;
  title: string;
  rightIcon: ImageSourcePropType;
  onPress: () => void;
  rightExtraContent?: string;
  variant?: "default" | "danger";
};

export function DividedPattern({
  Colors,
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
