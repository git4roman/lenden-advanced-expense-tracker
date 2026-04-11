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

  const {Colors}= useTheme()

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
      keyboardShouldPersistTaps="handled"
      style={{backgroundColor: Colors.neutral[500]}}
    >
      {config && (
        <View>
          <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
            <CText weight="bold" size="xmd">
              {config.label}
            </CText>
          </View>

          <config.screen />
        </View>
      )}
    </ScrollView>
  );
};

export default GeneralBottomSheetScreen;
