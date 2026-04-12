// CTextInput.tsx
import React from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { TextInput, TextInputProps } from "react-native-paper";
import { CText } from "./CText";
import { useTheme } from "../../providers/ThemeProviders";
import { fonts } from "../theme/typography";

interface CTextInputProps extends Omit<TextInputProps, "theme" | "error"> {
  containerStyle?: StyleProp<ViewStyle>;
  isDisabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  onChangeText?: any;
  error?: string;
  textStyle?: StyleProp<TextStyle>;
}

export const CTextInput: React.FC<CTextInputProps> = ({
  textStyle,
  containerStyle,
  isDisabled,
  multiline = false,
  numberOfLines,
  style,
  onChangeText,
  error,
  ...props
}) => {
  const { Colors } = useTheme();

  const sharedTheme = {
    colors: {
      onSurfaceVariant: Colors.neutral[500],
    },
    fonts: {
      bodyLarge: { fontFamily: fonts.regular },
      bodyMedium: { fontFamily: fonts.regular },
      bodySmall: { fontFamily: fonts.regular },
      labelLarge: { fontFamily: fonts.regular },
      labelMedium: { fontFamily: fonts.regular },
      labelSmall: { fontFamily: fonts.regular },
    },
  };

  return (
    <View style={containerStyle}>
      <TextInput
        onChangeText={onChangeText}
        disabled={isDisabled}
        multiline={multiline}
        numberOfLines={multiline ? (numberOfLines ?? 4) : 1}
        mode="outlined"
        outlineColor={
          error
            ? (Colors.warning[500] ?? Colors.warning[500])
            : Colors.warning[500]
        }
        activeOutlineColor={
          error
            ? (Colors.warning[500] ?? Colors.warning[500])
            : Colors.neutral[500]
        }
        outlineStyle={{
          borderColor: error
            ? (Colors.warning[500] ?? Colors.warning[500])
            : Colors.warning[500],
          borderRadius: 8,
          borderWidth: 1,
        }}
        theme={sharedTheme}
        style={[
          {
            opacity: 1,
            fontFamily: fonts.regular,
            fontSize: 13,
            ...(multiline && {
              minHeight: 100,
              textAlignVertical: "top",
            }),
          },
          style,
        ]}
        contentStyle={[
          {
            paddingTop: 14,
            paddingBottom: 14,
            paddingHorizontal: 16,
            fontWeight: "400",
            fontFamily: fonts.regular,
          },
          textStyle,
        ]}
        {...props}
      />
      {!!error && (
        <CText
          size="xs"
          color="error"
          shade={500}
          style={{ marginTop: 4, marginLeft: 4 }}
        >
          {error}
        </CText>
      )}
    </View>
  );
};
