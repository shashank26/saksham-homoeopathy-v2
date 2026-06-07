import { LoginPrimaryButton } from "@/components/auth/login/LoginPrimaryButton";
import {
  VitalityDrawerFooter,
  VitalityDrawerSheet,
} from "@/components/common/VitalityDrawerSheet";
import { VitalityDrawerHeader } from "@/components/common/VitalityDrawerHeader";
import { BookingSlotGrid } from "@/components/bookings/user/BookingSlotGrid";
import { useVitalityFonts } from "@/hooks/useVitalityFonts";
import {
  BookingService,
  SlotStatusMap,
  slots,
  SlotTime,
} from "@/services/Booking.service";
import { MomentService } from "@/services/Moment.service";
import { loginColors, loginSpacing } from "@/themes/loginDesign";
import { toast } from "burnt";
import { FC, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type SlotUnblockerSheetProps = {
  selectedDate: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SlotUnblockerSheet: FC<SlotUnblockerSheetProps> = ({
  selectedDate,
  open,
  onOpenChange,
}) => (
  <VitalityDrawerSheet<void>
    open={open}
    onOpenChange={onOpenChange}
    frameBackgroundColor={loginColors.surfaceContainerLowest}
    Child={({ onClose }) => (
      <SlotUnblockerForm
        selectedDate={selectedDate}
        onClose={() => onClose()}
      />
    )}
  />
);

const SlotUnblockerForm = ({
  selectedDate,
  onClose,
}: {
  selectedDate: Date;
  onClose: () => void;
}) => {
  const fontsLoaded = useVitalityFonts();
  const [selectedSlots, setSelectedSlots] = useState<SlotTime[]>([]);
  const [slotStatusBySlot, setSlotStatusBySlot] = useState<SlotStatusMap>({});

  useEffect(() => {
    const unsubscribe = BookingService.getSlotsForDateUpdate(
      selectedDate,
      (statusBySlot) => {
        setSlotStatusBySlot(statusBySlot);
        setSelectedSlots([]);
      },
    );
    return unsubscribe;
  }, [selectedDate]);

  const blockedSlots = useMemo(
    () =>
      slots.filter(
        (slot) => slotStatusBySlot[slot.value] === "blocked",
      ),
    [slotStatusBySlot],
  );

  if (!fontsLoaded) {
    return null;
  }

  const toggleSlot = (value: SlotTime) => {
    setSelectedSlots((prev) =>
      prev.includes(value)
        ? prev.filter((s) => s !== value)
        : [...prev, value],
    );
  };

  const allSelected =
    blockedSlots.length > 0 &&
    selectedSlots.length === blockedSlots.length;

  return (
    <View style={styles.formRoot}>
      <VitalityDrawerHeader title="Unblock Slots" onClose={onClose} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.dateLabel}>
          {MomentService.getDDMMMYYY(selectedDate)}
        </Text>
        {blockedSlots.length === 0 ? (
          <Text style={styles.empty}>
            No slots are blocked on this date.
          </Text>
        ) : (
          <>
            <Pressable
              onPress={() => {
                if (allSelected) {
                  setSelectedSlots([]);
                } else {
                  setSelectedSlots(blockedSlots.map((s) => s.value));
                }
              }}
            >
              {({ pressed }) => (
                <View
                  style={[styles.selectAll, pressed && styles.selectAllPressed]}
                >
                  <Text style={styles.selectAllText}>
                    {allSelected ? "Unselect All Slots" : "Select All Slots"}
                  </Text>
                </View>
              )}
            </Pressable>
            <BookingSlotGrid
              compact
              sectionTitle="SELECT SLOTS TO UNBLOCK"
              slots={blockedSlots}
              selectedSlots={selectedSlots}
              onSelectSlot={toggleSlot}
            />
          </>
        )}
      </ScrollView>
      {blockedSlots.length > 0 ? (
        <VitalityDrawerFooter
          backgroundColor={loginColors.surfaceContainerLowest}
        >
          <LoginPrimaryButton
            label="Unblock slots"
            loadingLabel="Unblocking..."
            disabled={selectedSlots.length === 0}
            style={styles.submitButton}
            onPress={() => {
              BookingService.unblockBooking(selectedDate, selectedSlots);
              toast({
                preset: "done",
                title: "Slots Unblocked Successfully",
              });
              onClose();
            }}
          />
        </VitalityDrawerFooter>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  formRoot: {
    flexShrink: 1,
    maxHeight: "90%",
  },
  scrollContent: {
    paddingHorizontal: loginSpacing.containerMargin,
    paddingBottom: loginSpacing.stackMd,
  },
  dateLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 16,
    color: loginColors.onSurface,
    marginBottom: loginSpacing.stackMd,
  },
  empty: {
    fontFamily: "Manrope_400Regular",
    fontSize: 16,
    color: loginColors.onSurfaceVariant,
    textAlign: "center",
    marginTop: loginSpacing.stackLg,
  },
  selectAll: {
    marginBottom: loginSpacing.stackMd,
    paddingVertical: loginSpacing.stackSm,
    alignItems: "center",
  },
  selectAllPressed: {
    opacity: 0.8,
  },
  selectAllText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 14,
    color: loginColors.onSurface,
  },
  submitButton: {
    marginTop: 0,
  },
});
