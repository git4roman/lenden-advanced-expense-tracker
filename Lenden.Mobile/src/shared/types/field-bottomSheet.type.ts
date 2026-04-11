import { ComponentType } from "react";

export type SheetFieldConfig<T = any> = {
  label: string;
  api?: string;
  screen?: ComponentType<T>;
  data?: () => any;
};
