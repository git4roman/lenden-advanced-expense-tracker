import { View, ScrollView } from "react-native";
import React from "react";
import {
  SheetField,
  sheetFieldConfig,
} from "../../types/field-bottomSheet.config";
import { CText } from "../../ui/components/CText";
import { useTheme } from "../../providers/ThemeProviders";

const GeneralBottomSheetScreen = ({ field }: { field: SheetField }) => {
  console.log("Field", field);
  const config = sheetFieldConfig[field];
  console.log("config", config);

  const { Colors } = useTheme();

  return (
    <>
      {config && (
        <View
          style={{
            backgroundColor: Colors.neutral[900],
            flex: 1,
            paddingHorizontal: 20,
            paddingVertical: 10,
            gap: 16,
          }}
        >
          <View style={{ paddingHorizontal: 16 }}>
            <CText weight="bold" size="xmd" color="neutral" shade={50}>
              {config.label}
            </CText>
          </View>

          <config.screen />
        </View>
      )}
    </>
  );
};

export default GeneralBottomSheetScreen;
