import { Colors } from "../theme/colors";
import { fonts, fontSizes, lineHeights, textStyles } from "../theme/typography";
import { Text, TextProps, TextStyle } from "react-native";

export type Weight = keyof typeof fonts;
type Size = keyof typeof fontSizes;
type ColorKey = keyof typeof Colors | string;
type Shade = keyof (typeof Colors)["primary"];

interface CTextProps extends TextProps {
  weight?: Weight;
  size?: Size;
  color?: ColorKey;
  shade?: Shade;
  children: React.ReactNode;
  style?: TextStyle;
  lineHeight?: number;
  letterSpacing?: number;
  italic?: boolean;
}

export const CText: React.FC<CTextProps> = ({
  weight = "regular",
  size = "sm",
  color = "neutral",
  shade = 900,
  style,
  children,
  italic = false,
  lineHeight: customLineHeight,
  letterSpacing: customLetterSpacing,
  ...props
}) => {
  const colorValue = Colors[color as keyof typeof Colors];
  const textColor =
    typeof colorValue === "string"
      ? colorValue
      : (colorValue?.[shade as keyof typeof colorValue] ?? color);

  const fontSize = fontSizes[size];
  // const defaultLineHeight = Math.round(fontSize * 1.64);
  const lineHeight =
    customLineHeight ??
    lineHeights[size as keyof typeof lineHeights] ??
    Math.round(fontSize * 1.5);
  const letterSpacing = customLetterSpacing ?? 0.2;
  const fontKey = italic
    ? (`${weight}Italic` as keyof typeof textStyles)
    : weight;

  return (
    <Text
      style={[
        textStyles[fontKey],
        {
          fontSize,
          lineHeight,
          color: textColor,
          letterSpacing: letterSpacing,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
