import {
  loginColors,
  loginRadius,
  loginSpacing,
} from "@/themes/loginDesign";
import { Sheet } from "@tamagui/sheet";
import { BlurView } from "expo-blur";
import React, { FC, ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

export type VitalityDrawerSheetProps<T = unknown> = {
  FC?: FC<{ setOpen: React.Dispatch<React.SetStateAction<boolean>> }>;
  Child: FC<{ onClose: (data: T | undefined) => void }>;
  onClose?: (data: T | undefined) => void;
  frameBackgroundColor?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const VitalityDrawerSheet = <T,>({
  FC,
  Child,
  onClose,
  frameBackgroundColor = loginColors.surface,
  open: controlledOpen,
  onOpenChange,
}: VitalityDrawerSheetProps<T>) => {
  const [position, setPosition] = React.useState(0);
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen: React.Dispatch<React.SetStateAction<boolean>> = (value) => {
    const next = typeof value === "function" ? value(open) : value;
    if (isControlled) {
      onOpenChange?.(next);
    } else {
      setInternalOpen(next);
    }
  };

  const handleClose = (data: T | undefined) => {
    setOpen(false);
    onClose?.(data);
  };

  return (
    <>
      {FC ? <FC setOpen={setOpen} /> : null}
      <Sheet
        moveOnKeyboardChange
        forceRemoveScrollEnabled={open}
        modal
        open={open}
        onOpenChange={setOpen}
        snapPointsMode="fit"
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="medium"
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          opacity={1}
        >
          <BlurView
            intensity={Platform.OS === "ios" ? 4 : 8}
            tint="dark"
            style={StyleSheet.absoluteFill}
            experimentalBlurMethod={
              Platform.OS === "android" ? "dimezisBlurView" : undefined
            }
          />
          <View style={styles.scrimTint} />
        </Sheet.Overlay>

        <Sheet.Frame
          padding={0}
          backgroundColor={frameBackgroundColor}
          borderTopLeftRadius={loginRadius.xl}
          borderTopRightRadius={loginRadius.xl}
          borderTopWidth={1}
          borderColor={loginColors.outlineVariant}
          overflow="hidden"
        >
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>
          <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
          >
            <Child onClose={handleClose} />
          </KeyboardAvoidingView>
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

type VitalityDrawerFooterProps = {
  children: ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
};

export const VitalityDrawerFooter: FC<VitalityDrawerFooterProps> = ({
  children,
  backgroundColor = loginColors.surface,
  style,
}) => (
  <View style={[styles.footer, { backgroundColor }, style]}>{children}</View>
);

const styles = StyleSheet.create({
  scrimTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11, 28, 48, 0.4)",
  },
  handleRow: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 32,
    height: 6,
    borderRadius: 999,
    backgroundColor: loginColors.outlineVariant,
  },
  keyboardView: {
    flexShrink: 1,
    maxHeight: "100%",
  },
  footer: {
    paddingHorizontal: loginSpacing.containerMargin,
    paddingVertical: loginSpacing.containerMargin,
    borderTopWidth: 1,
    borderTopColor: loginColors.outlineVariant,
  },
});
