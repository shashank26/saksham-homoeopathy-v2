import { useAuth } from "@/components/auth/hooks/useAuth";
import {
  BookingService,
  SlotStatusMap,
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
  onSuccess?: () => void;
};

export const BookingForm: FC<BookingFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("other");
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    getDefaultBookingDate(),
  );
  const [selectedSlot, setSelectedSlot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [slotStatusBySlot, setSlotStatusBySlot] = useState<SlotStatusMap>({});
  const [unavailableSlots, setUnavailableSlots] = useState<SlotTime[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!isDateInBookingRange(selectedDate)) {
      setSelectedDate(getDefaultBookingDate());
      setSelectedSlot("");
    }
  }, [selectedDate]);

  useEffect(() => {
    const unsub = BookingService.getSlotsForDateUpdate(
      selectedDate,
      setSlotStatusBySlot,
    );
    return unsub;
  }, [selectedDate]);

  useEffect(() => {
    const unavailable = slots
      .filter((slot) => {
        const status = slotStatusBySlot[slot.value];
        const isUnavailable = BookingService.isSlotUnavailable(status);
        const isSlotExpired = MomentService.isSlotExpired(
          selectedDate,
          slot.value,
        );
        return isUnavailable || isSlotExpired;
      })
      .map((slot) => slot.value);

    setUnavailableSlots(unavailable);

    if (selectedSlot && unavailable.includes(selectedSlot as SlotTime)) {
      setSelectedSlot("");
    }
  }, [selectedDate, slotStatusBySlot, selectedSlot]);

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
          title: "Slot unavailable",
          message: "This slot was just booked. Please pick another time.",
          preset: "error",
          duration: 5,
        });
        setSelectedSlot("");
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
        slots={slots}
        unavailableSlots={unavailableSlots}
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
