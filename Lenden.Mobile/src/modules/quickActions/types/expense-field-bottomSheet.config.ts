import AddPayersBottomSheetScreen from "@/src/shared/components/BottomSheetComponents/add-payers-bottomSheet-screen";
import AddSplittersBottomSheetScreen from "@/src/shared/components/BottomSheetComponents/add-splitter-bottomSheet-screen";
import SelectGroupScreen from "@/src/shared/components/BottomSheetComponents/select-group-bottomSheet-screen";
import { SheetFieldConfig } from "@/src/shared/types/field-bottomSheet.type";

export const expenseFieldConfig = {
  addPayers: {
    label: "Add Payers",
    api: "",
    screen: AddPayersBottomSheetScreen,
    snapPoints: ["50%"],
    enableDynamicSizing: false,
  },
  addSplitters: {
    label: "Add Splitters",
    api: "",
    screen: AddSplittersBottomSheetScreen,
    snapPoints: ["50%"],
    enableDynamicSizing: false,
  },
  selectGroup: {
    label: "Select Group",
    api: "",
    screen: SelectGroupScreen,
    snapPoints: ["50%"],
    enableDynamicSizing: false,
  },
} satisfies Record<string, SheetFieldConfig>;
