import React, { useMemo } from "react";
import { useBottomSheet } from "@/src/shared/hooks/use-base-bottomSheet";
import {
  SheetField,
  sheetFieldConfig,
} from "@/src/shared/types/field-bottomSheet.config";
import { SheetFieldConfig } from "@/src/shared/types/field-bottomSheet.type";
import BottomSheetComponent from "./BottomSheetComponent";

const DEFAULT_SNAP_POINTS = ["40%", "50%", "75%", "95%"];

const GeneralBottomSheet = () => {
  const { bottomSheetRef, closeSheet, activeField } = useBottomSheet();

  const config = activeField
    ? (sheetFieldConfig[activeField as SheetField] as SheetFieldConfig)
    : null;

  const snapPoints = useMemo(
    () => config?.snapPoints ?? DEFAULT_SNAP_POINTS,
    [activeField],
  );

  const Screen = config?.screen;
  const enableDynamicSizing = config?.enableDynamicSizing ?? true;

  if (!activeField) return null;

  return (
    <BottomSheetComponent
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={0}
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

export default GeneralBottomSheet;
