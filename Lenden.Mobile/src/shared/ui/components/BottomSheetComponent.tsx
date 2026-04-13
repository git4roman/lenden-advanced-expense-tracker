import BottomSheet from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Colors } from "../theme/colors";

type BottomSheetComponentProps = {
  children: React.ReactNode;
  snapPoints?: string[];
  index?: number;
  enablePanDownToClose?: boolean;
  enableDynamicSizing?: boolean;
  backgroundStyle?: ViewStyle;
  handleIndicatorStyle?: ViewStyle;
  onChange?: (index: number) => void;
  [key: string]: any;
};

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetComponentProps>(
  function BottomSheetComponent(
    {
      children,
      snapPoints = ["25%", "50%", "90%"],
      index = -1,
      enablePanDownToClose = true,
      enableDynamicSizing = true,
      backgroundStyle,
      handleIndicatorStyle,
      onChange,
      ...props
    },
    ref,
  ) {
    const points = useMemo(() => snapPoints, [snapPoints]);

    return (
      <BottomSheet
        ref={ref}
        index={index}
        snapPoints={points}
        enablePanDownToClose={enablePanDownToClose}
        enableDynamicSizing={enableDynamicSizing}
        onChange={onChange}
        // backdropComponent={renderBackdrop}
        backgroundStyle={[
          styles.background,
          backgroundStyle,
          { backgroundColor: Colors.primary[500] },
        ]}
        handleIndicatorStyle={[
          styles.handleIndicator,
          handleIndicatorStyle,
          { backgroundColor: Colors.neutral[800] },
        ]}
        {...props}
      >
        {children}
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  background: {
    // backgroundColor: "red",
    borderRadius: 20,
  },
  handleIndicator: {
    backgroundColor: "#ccc",
    width: 40,
  },
});

export default BottomSheetComponent;
