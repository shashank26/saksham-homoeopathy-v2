import { useAuth } from "@/components/auth/hooks/useAuth";
import {
  BookingService,
  BookingType,
  slots,
  SlotTime,
} from "@/services/Booking.service";
import { MomentService } from "@/services/Moment.service";
import {
  loginColors,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { toast } from "burnt";
import { FC, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BookingConfirmButton } from "./BookingConfirmButton";
import { BookingDateStrip } from "./BookingDateStrip";
import { BookingGenderSelect } from "./BookingGenderSelect";
import { BookingSlotGrid } from "./BookingSlotGrid";
import {
  getDefaultBookingDate,
  isDateInBookingRange,
} from "./bookingDateUtils";
import { BookingTextField } from "./BookingTextField";

type BookingFormProps = {
  currentBookings: BookingType[];
  onSuccess?: () => void;
};

export const BookingForm: FC<BookingFormProps> = ({
  currentBookings,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("other");
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    getDefaultBookingDate(),
  );
  const [selectedSlot, setSelectedSlot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<
    { label: string; value: SlotTime }[]
  >([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!isDateInBookingRange(selectedDate)) {
      setSelectedDate(getDefaultBookingDate());
      setSelectedSlot("");
    }
  }, [selectedDate]);

  useEffect(() => {
    BookingService.getBlockedSlots(selectedDate).then((blockedSlots) => {
      const allSlots = slots.filter((slot) => {
        const isBlocked = blockedSlots.some(
          (blockedSlot) => blockedSlot === slot.value,
        );
        const isBooked = currentBookings.some(
          (booking) =>
            MomentService.getDDMMMYYY(booking.date) ===
              MomentService.getDDMMMYYY(selectedDate) &&
            booking.slot === slot.value,
        );
        const isSlotExpired = MomentService.isSlotExpired(
          selectedDate,
          slot.value,
        );
        return !isBlocked && !isBooked && !isSlotExpired;
      });
      setAvailableSlots(allSlots);
    });
  }, [selectedDate, currentBookings]);

  const canSubmit =
    name.trim().length > 0 &&
    age.length > 0 &&
    selectedSlot.length > 0 &&
    !submitting;

  const handleConfirm = async () => {
    if (!canSubmit || !selectedSlot) return;
    setSubmitting(true);
    try {
      const booking = await BookingService.addBooking({
        date: selectedDate,
        slot: selectedSlot as SlotTime,
        phoneNumber: user?.phoneNumber || "",
        person: { name: name.trim(), age, sex },
      });
      if (booking) {
        toast({
          title: "Booking Confirmed",
          preset: "done",
          duration: 5,
        });
        setName("");
        setAge("");
        setSex("other");
        setSelectedSlot("");
        onSuccess?.();
      } else {
        toast({
          title: "Booking Failed",
          message: "Please try again later.",
          preset: "error",
          duration: 5,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View>
      <BookingTextField
        label="Full Name"
        value={name}
        onChangeText={setName}
        placeholder="e.g. John Doe"
        required
        maxLength={25}
        showCount
      />
      <View style={styles.row}>
        <View style={styles.half}>
          <BookingTextField
            label="Age"
            value={age}
            onChangeText={(text) => {
              if (/^\d*$/.test(text)) setAge(text.slice(0, 2));
            }}
            placeholder="Years"
            required
            keyboardType="numeric"
            maxLength={2}
          />
        </View>
        <View style={styles.half}>
          <BookingGenderSelect
            value={sex}
            onValueChange={setSex}
            required
          />
        </View>
      </View>

      <BookingDateStrip
        selectedDate={selectedDate}
        onSelectDate={(date) => {
          setSelectedDate(date);
          setSelectedSlot("");
        }}
      />

      <BookingSlotGrid
        slots={availableSlots}
        selectedSlot={selectedSlot}
        onSelectSlot={(value) => setSelectedSlot(value)}
      />

      <BookingConfirmButton
        label="Confirm Appointment"
        disabled={!canSubmit}
        loading={submitting}
        onPress={handleConfirm}
      />
      <Text style={styles.footerNote}>
        You will receive a confirmation message shortly.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: loginSpacing.gutter,
  },
  half: {
    flex: 1,
  },
  footerNote: {
    ...loginTypography.labelSm,
    color: loginColors.onSurfaceVariant,
    textAlign: "center",
    marginTop: loginSpacing.stackMd,
  },
});
