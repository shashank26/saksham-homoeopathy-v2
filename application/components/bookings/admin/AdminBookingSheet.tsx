import { LoginPrimaryButton } from "@/components/auth/login/LoginPrimaryButton";
import { BookingSlotGrid } from "@/components/bookings/user/BookingSlotGrid";
import { BookingGenderSelect } from "@/components/bookings/user/BookingGenderSelect";
import { BookingTextField } from "@/components/bookings/user/BookingTextField";
import {
  VitalityDrawerFooter,
  VitalityDrawerSheet,
} from "@/components/common/VitalityDrawerSheet";
import { VitalityDrawerHeader } from "@/components/common/VitalityDrawerHeader";
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

type AdminBookingSheetProps = {
  selectedDate: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AdminBookingSheet: FC<AdminBookingSheetProps> = ({
  selectedDate,
  open,
  onOpenChange,
}) => (
  <VitalityDrawerSheet<void>
    open={open}
    onOpenChange={onOpenChange}
    frameBackgroundColor={loginColors.surfaceContainerLowest}
    Child={({ onClose }) => (
      <AdminBookingForm
        selectedDate={selectedDate}
        onClose={() => onClose()}
      />
    )}
  />
);

const AdminBookingForm = ({
  selectedDate,
  onClose,
}: {
  selectedDate: Date;
  onClose: () => void;
}) => {
  const fontsLoaded = useVitalityFonts();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("other");
  const [selectedSlots, setSelectedSlots] = useState<SlotTime[]>([]);
  const [slotStatusBySlot, setSlotStatusBySlot] = useState<SlotStatusMap>({});
  const [submitting, setSubmitting] = useState(false);

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

  const unavailableSlots = useMemo(
    () =>
      slots
        .filter((slot) => {
          const status = slotStatusBySlot[slot.value];
          const isUnavailable = BookingService.isSlotUnavailable(status);
          const isExpired = MomentService.isSlotExpired(
            selectedDate,
            slot.value,
          );
          return isUnavailable || isExpired;
        })
        .map((slot) => slot.value),
    [slotStatusBySlot, selectedDate],
  );

  const bookableSlots = useMemo(
    () =>
      slots.filter(
        (slot) => !unavailableSlots.includes(slot.value),
      ),
    [unavailableSlots],
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
    bookableSlots.length > 0 &&
    selectedSlots.length === bookableSlots.length;

  const canSubmit =
    phoneNumber.trim().length > 0 &&
    name.trim().length > 0 &&
    age.trim().length > 0 &&
    selectedSlots.length > 0 &&
    !submitting;

  return (
    <View style={styles.formRoot}>
      <VitalityDrawerHeader title="Book Slots" onClose={onClose} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.dateLabel}>
          {MomentService.getDDMMMYYY(selectedDate)}
        </Text>
        <BookingTextField
          label="Patient Phone"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Phone number"
          keyboardType="phone-pad"
        />
        <BookingTextField
          label="Patient Name"
          value={name}
          onChangeText={setName}
          placeholder="Full name"
        />
        <BookingTextField
          label="Age"
          value={age}
          onChangeText={setAge}
          placeholder="Age"
          keyboardType="numeric"
        />
        <BookingGenderSelect value={sex} onValueChange={setSex} />
        {bookableSlots.length === 0 ? (
          <Text style={styles.empty}>
            No available slots for this date.
          </Text>
        ) : (
          <>
            <Pressable
              onPress={() => {
                if (allSelected) {
                  setSelectedSlots([]);
                } else {
                  setSelectedSlots(bookableSlots.map((s) => s.value));
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
              sectionTitle="SELECT SLOTS TO BOOK"
              slots={slots}
              unavailableSlots={unavailableSlots}
              selectedSlots={selectedSlots}
              onSelectSlot={toggleSlot}
            />
          </>
        )}
      </ScrollView>
      {bookableSlots.length > 0 ? (
        <VitalityDrawerFooter
          backgroundColor={loginColors.surfaceContainerLowest}
        >
          <LoginPrimaryButton
            label={
              selectedSlots.length > 0
                ? `Book ${selectedSlots.length} slot${selectedSlots.length > 1 ? "s" : ""}`
                : "Book slots"
            }
            loadingLabel="Booking..."
            disabled={!canSubmit}
            loading={submitting}
            style={styles.submitButton}
            onPress={async () => {
              if (!canSubmit) return;
              setSubmitting(true);
              try {
                const { succeeded, failed } =
                  await BookingService.addBookings(
                    {
                      phoneNumber: phoneNumber.trim(),
                      date: selectedDate,
                      person: {
                        name: name.trim(),
                        age: age.trim(),
                        sex,
                      },
                    },
                    selectedSlots,
                  );

                if (succeeded.length > 0) {
                  toast({
                    preset: "done",
                    title:
                      failed.length > 0
                        ? `Booked ${succeeded.length} slot(s); ${failed.length} unavailable`
                        : "Slots booked successfully",
                  });
                  onClose();
                } else {
                  toast({
                    preset: "error",
                    title: "Could not book slots",
                    message: "Selected slots may no longer be available.",
                  });
                }
              } finally {
                setSubmitting(false);
              }
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
    maxHeight: "100%",
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
