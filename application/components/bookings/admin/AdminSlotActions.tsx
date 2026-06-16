import { AdminBookingSheet } from "@/components/bookings/admin/AdminBookingSheet";
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
  const [bookOpen, setBookOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [unblockOpen, setUnblockOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable style={styles.pressable} onPress={() => setBookOpen(true)}>
        {({ pressed }) => (
          <View style={[styles.buttonPrimary, pressed && styles.buttonPressed]}>
            <Text style={styles.buttonPrimaryText}>Book Slots</Text>
          </View>
        )}
      </Pressable>
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
      </View>
      <AdminBookingSheet
        selectedDate={selectedDate}
        open={bookOpen}
        onOpenChange={setBookOpen}
      />
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
  container: {
    marginTop: loginSpacing.stackMd,
    gap: loginSpacing.stackMd,
  },
  row: {
    flexDirection: "row",
  },
  pressable: {
    flex: 1,
    marginRight: loginSpacing.stackMd,
  },
  pressableEnd: {
    flex: 1,
  },
  buttonPrimary: {
    minHeight: 48,
    borderRadius: loginRadius.md,
    backgroundColor: loginColors.secondary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: loginSpacing.stackMd,
    paddingVertical: loginSpacing.stackSm,
  },
  buttonPrimaryText: {
    ...loginTypography.labelMd,
    color: "#fff",
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
