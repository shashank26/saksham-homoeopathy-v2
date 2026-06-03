import { SlotBlockerSheet } from "@/components/bookings/helper/SlotBlocker";
import { SlotUnblockerSheet } from "@/components/bookings/helper/SlotUnblocker";
import {
  loginColors,
  loginRadius,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type AdminSlotActionsProps = {
  selectedDate: Date;
};

export const AdminSlotActions: FC<AdminSlotActionsProps> = ({
  selectedDate,
}) => {
  const [blockOpen, setBlockOpen] = useState(false);
  const [unblockOpen, setUnblockOpen] = useState(false);

  return (
    <View style={styles.row}>
      <Pressable
        style={styles.pressable}
        onPress={() => setBlockOpen(true)}
      >
        {({ pressed }) => (
          <View style={[styles.button, pressed && styles.buttonPressed]}>
            <Text style={styles.buttonText}>Block Slots</Text>
          </View>
        )}
      </Pressable>
      <Pressable
        style={styles.pressableEnd}
        onPress={() => setUnblockOpen(true)}
      >
        {({ pressed }) => (
          <View style={[styles.button, pressed && styles.buttonPressed]}>
            <Text style={styles.buttonText}>Unblock Slots</Text>
          </View>
        )}
      </Pressable>
      <SlotBlockerSheet
        selectedDate={selectedDate}
        open={blockOpen}
        onOpenChange={setBlockOpen}
      />
      <SlotUnblockerSheet
        selectedDate={selectedDate}
        open={unblockOpen}
        onOpenChange={setUnblockOpen}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: loginSpacing.stackMd,
  },
  pressable: {
    flex: 1,
    marginRight: loginSpacing.stackMd,
  },
  pressableEnd: {
    flex: 1,
  },
  button: {
    minHeight: 48,
    borderRadius: loginRadius.md,
    borderWidth: 1,
    borderColor: loginColors.secondary,
    backgroundColor: loginColors.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: loginSpacing.stackMd,
    paddingVertical: loginSpacing.stackSm,
  },
  buttonPressed: {
    backgroundColor: loginColors.surfaceContainer,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    ...loginTypography.labelMd,
    color: loginColors.secondary,
  },
});
