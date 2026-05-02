import { groupFieldConfig } from "@/src/modules/groups/types/group-field-bottomSheet.config";
import { expenseFieldConfig } from "@/src/modules/quickActions/expense/types/expense-field-bottomSheet.config";

export const sheetFieldConfig = {
  ...expenseFieldConfig,
  ...groupFieldConfig,
};

type ExpenseFieldKeys = keyof typeof expenseFieldConfig;
type GroupField = keyof typeof groupFieldConfig;

export type SheetField = ExpenseFieldKeys | GroupField;
