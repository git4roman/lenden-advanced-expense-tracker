import AddPayersBottomSheetScreen from "@/src/modules/quickActions/expense/components/BottomSheetComponents/add-payers-bottomSheet-screen";
import AddSplittersBottomSheetScreen from "@/src/modules/quickActions/expense/components/BottomSheetComponents/add-splitter-bottomSheet-screen";
import SelectGroupScreen from "@/src/modules/quickActions/expense/components/BottomSheetComponents/select-group-bottomSheet-screen";
import SelectParticipantsScreen from "@/src/modules/quickActions/expense/components/BottomSheetComponents/select-participants-bottomSheet-screen";
import { SheetFieldConfig } from "@/src/shared/types/field-bottomSheet.type";

export const expenseFieldConfig = {
  addPayers: {
    screen: AddPayersBottomSheetScreen,
    snapPoints: ["90%"],
    enableDynamicSizing: false,
  },
  addSplitters: {
    screen: AddSplittersBottomSheetScreen,
    snapPoints: ["90%"],
    enableDynamicSizing: false,
  },
  selectGroup: {
    screen: SelectGroupScreen,
    snapPoints: ["70%"],
    enableDynamicSizing: false,
  },
  selectParticipants: {
    screen: SelectParticipantsScreen,
    snapPoints: ["70%"],
    enableDynamicSizing: false,
  },
} satisfies Record<string, SheetFieldConfig>;
