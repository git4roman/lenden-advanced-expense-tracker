import { CText, ThemeColors } from "@/src/shared";
import { Pressable, View } from "react-native";

export const ActionCard = ({
  Colors,
  label,
  description,
  onPress,
  icon,
}: {
  Colors: ThemeColors;
  label: string;
  description: string;
  onPress: () => void;
  icon: React.ReactNode;
}) => (
  <View style={{ gap: 6 }}>
    <CText weight="semibold" size="md" color="neutral" shade={100}>
      {label}
    </CText>
    <View
      style={{
        backgroundColor: Colors.neutral[800],
        borderRadius: 18,
        padding: 14,
        borderWidth: 1,
        borderColor: Colors.neutral[700],
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <View style={{ flex: 1 }}>
        <CText size="sm" color="neutral" shade={400}>
          {description}
        </CText>
      </View>
      <Pressable
        onPress={onPress}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: Colors.accent[500],
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {icon}
      </Pressable>
    </View>
  </View>
);
