import { useBottomSheetContext } from "../providers/BottomSheetProviders";
import { SheetField } from "../types/field-bottomSheet.config";

export const useBottomSheet = <TField extends SheetField>() => {
  const {
    activeField,
    setActiveField,
    currentValue,
    setCurrentValue,
    onSelectCallback,
    setOnSelectCallback,
    bottomSheetRef,
    snapIndex,
    setSnapIndex,
  } = useBottomSheetContext();

  const openSheet = (
    field: TField,
    callback?: (value: any) => void,
    initialValue?: any,
    index: number = 0,
  ) => {
    setSnapIndex(index);
    setActiveField(field);
    setOnSelectCallback(() => callback ?? null);
    setCurrentValue(initialValue ?? null);
    // bottomSheetRef.current?.expand();
    // bottomSheetRef.current?.snapToIndex(index);
  };

  const selectValue = (value: any) => {
    onSelectCallback?.(value);
    setTimeout(() => {
      closeSheet();
    }, 400);
  };

  const closeSheet = () => {
    bottomSheetRef.current?.close();
    setActiveField(null);
    setOnSelectCallback(null);
  };

  return {
    openSheet,
    selectValue,
    closeSheet,
    activeField,
    currentValue,
    setCurrentValue,
    bottomSheetRef,
    onSelectCallback,
    snapIndex,
  };
};
