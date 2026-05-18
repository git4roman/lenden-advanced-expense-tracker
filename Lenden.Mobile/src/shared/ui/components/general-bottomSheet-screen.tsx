import { useBottomSheet } from "@/src/shared/hooks/use-base-bottomSheet";
import {
  SheetField,
  sheetFieldConfig,
} from "@/src/shared/types/field-bottomSheet.config";
import { SheetFieldConfig } from "@/src/shared/types/field-bottomSheet.type";
import React, { useMemo } from "react";
import BottomSheetComponent from "./BottomSheetComponent";

const DEFAULT_SNAP_POINTS = ["40%", "50%", "75%", "95%"];

export const GeneralBottomSheet = () => {
  const { bottomSheetRef, closeSheet, activeField, snapIndex } =
    useBottomSheet();

  const config = activeField
    ? (sheetFieldConfig[activeField as SheetField] as SheetFieldConfig)
    : null;

  const snapPoints = useMemo(
    () => config?.snapPoints ?? DEFAULT_SNAP_POINTS,
    [activeField],
  );

  const Screen = config?.screen;
  const enableDynamicSizing = config?.enableDynamicSizing ?? true;

  console.log("snapIndex", enableDynamicSizing);
  if (!activeField) return null;

  return (
    <BottomSheetComponent
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={snapIndex}
      onChange={(index: number) => index === -1 && closeSheet()}
      enableOverDrag={false}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={true}
      enableDynamicSizing={enableDynamicSizing}
    >
      {Screen && <Screen />}
    </BottomSheetComponent>
  );
};
