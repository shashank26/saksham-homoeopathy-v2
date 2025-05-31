import { themeColors } from "@/themes/themes";
import { Sheet } from "@tamagui/sheet";
import React, { FC } from "react";

export type DrawerSheetProps<T = unknown> = {
  FC: React.FC<{ setOpen: React.Dispatch<React.SetStateAction<boolean>> }>;
  Child: React.FC<{ onClose: (data: T | undefined) => void }>;
  onClose?: (data: T | undefined) => void;
};

export const DrawerSheet = <T,>({
  FC,
  Child,
  onClose,
}: DrawerSheetProps<T>) => {
  const [position, setPosition] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <FC setOpen={setOpen} />
      <Sheet
        moveOnKeyboardChange={true}
        forceRemoveScrollEnabled={open}
        modal={true}
        open={open}
        onOpenChange={setOpen}
        snapPointsMode={"fit"}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="medium"
      >
        <Sheet.Overlay
          animation="lazy"
          backgroundColor="$shadow6"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Sheet.Handle />
        <Sheet.Frame
          padding="$4"
          justifyContent="center"
          alignItems="center"
          backgroundColor={themeColors.plat}
          gap="$5"
        >
          <Child
            onClose={(data: T | undefined) => {
              setOpen(false);
              if (onClose) {
                onClose(data);
              }
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  );
};
