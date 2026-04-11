import AddPayersBottomSheetScreen from "@/src/shared/components/BottomSheetComponents/add-payers-bottomSheet-screen";
import AddSplittersBottomSheetScreen from "@/src/shared/components/BottomSheetComponents/add-splitter-bottomSheet-screen";
import { SheetFieldConfig } from "@/src/shared/types/field-bottomSheet.type";

export const expenseFieldConfig = {
  addPayers: {
    label: "Add Payers",
    api: "",
    screen: AddPayersBottomSheetScreen,
  },
  addSplitters: {
    label: "Add Splitters",
    api: "",
    screen: AddSplittersBottomSheetScreen,
  },
} satisfies Record<string, SheetFieldConfig>;
