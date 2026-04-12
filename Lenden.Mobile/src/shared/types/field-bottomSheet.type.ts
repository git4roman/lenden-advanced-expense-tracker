import { ComponentType } from "react";

export type SheetFieldConfig<T = any> = {
  label: string;
  api?: string;
  screen?: ComponentType;
  data?: () => any;
  snapPoints?: string[];
  enableDynamicSizing?: boolean;
};
