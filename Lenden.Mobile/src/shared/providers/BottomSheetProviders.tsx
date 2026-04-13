import BottomSheet from "@gorhom/bottom-sheet";
import React, { createContext, useContext, useRef, useState } from "react";
import { SheetField } from "../types/field-bottomSheet.config";

type BottomSheetContextType = {
  activeField: SheetField | null;
  setActiveField: (field: SheetField | null) => void;
  currentValue: any | null;
  setCurrentValue: (value: string | null) => void;
  onSelectCallback: ((value: string) => void) | null;
  setOnSelectCallback: (callback: ((value: string) => void) | null) => void;
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  snapIndex: number;
  setSnapIndex: (value: number) => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined,
);

export const BottomSheetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeField, setActiveField] = useState<SheetField | null>(null);
  const [currentValue, setCurrentValue] = useState<string | null>(null);
  const [onSelectCallback, setOnSelectCallback] = useState<
    ((value: string) => void) | null
  >(null);
  const [snapIndex, setSnapIndex] = useState<number>(0);
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <BottomSheetContext.Provider
      value={{
        activeField,
        setActiveField,
        currentValue,
        setCurrentValue,
        onSelectCallback,
        setOnSelectCallback,
        bottomSheetRef,
        snapIndex,
        setSnapIndex,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheetContext = () => {
  const ctx = useContext(BottomSheetContext);
  if (!ctx) {
    throw new Error(
      "useBottomSheetContext must be used within BottomSheetProvider",
    );
  }
  return ctx;
};
