import { ComponentType } from "react";

export type SheetFieldConfig<T = any> = {
  screen?: ComponentType;
  snapPoints?: string[];
  enableDynamicSizing?: boolean;
};
