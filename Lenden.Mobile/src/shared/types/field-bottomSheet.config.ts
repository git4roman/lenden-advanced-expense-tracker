import { expenseFieldConfig } from "@/src/modules/quickActions/types/expense-field-bottomSheet.config";

export const sheetFieldConfig = {
  ...expenseFieldConfig,
};

type ExpenseFieldKeys = keyof typeof expenseFieldConfig;

export type SheetField = ExpenseFieldKeys;
