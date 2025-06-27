import {
  BookingService,
  BookingType,
  SlotTime,
} from "@/services/Booking.service";
import { themeColors } from "@/themes/themes";
import { toast } from "burnt";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text, XStack, YStack } from "tamagui";
import { useAuth } from "../auth/hooks/useAuth";
import { DateTimePicker } from "../common/DateTimePicker";
import { DrawerSheet } from "../common/DrawerSheet";
import { FloatingRoundButton } from "../common/FloatingRoundButton";
import { AdminBookingList, BookingList } from "./BookingList";
import { MomentService } from "@/services/Moment.service";
import { Role } from "@/services/Firebase.service";

const slots: { label: string; value: SlotTime }[] = [
  { label: "11.30 AM", value: "11:30" },
  { label: "11.45 PM", value: "11:45" },
  { label: "12.00 PM", value: "12:00" },
  { label: "12.15 PM", value: "12:15" },
  { label: "12.30 PM", value: "12:30" },
  { label: "12.45 PM", value: "12:45" },
];

const BookingForm = ({
  onClose,
  currentBookings,
}: {
  onClose: () => void;
  currentBookings: BookingType[];
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const availableSlots = slots.filter((slot) => {
    const isBooked = currentBookings.some(
      (booking) =>
        MomentService.getDDMMMYYY(booking.date) ===
          MomentService.getDDMMMYYY(selectedDate) && booking.slot === slot.value
    );
    return !isBooked;
  });
  const { user } = useAuth();
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: themeColors.plat }}>
      <YStack gap={20}>
        <Text fontFamily={"$js4"} fontSize={"$4"} color={themeColors.onyx}>
          Booking Date
          <Text fontFamily={"$js4"} fontSize={"$4"} color={"red"}>
            *
          </Text>
        </Text>
        <DateTimePicker
          minDate={new Date()}
          mode="date"
          maxDate={new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)}
          onChange={(date) => {
            setSelectedDate(date);
            setSelectedSlot(""); // Reset selected slot when date changes
          }}
          value={selectedDate}
        />
      </YStack>
      <YStack gap={20} marginTop={50}>
        <Text fontFamily={"$js4"} fontSize={"$4"} color={themeColors.onyx}>
          Select a Slot
          <Text fontFamily={"$js4"} fontSize={"$4"} color={"red"}>
            *
          </Text>
        </Text>
        <XStack gap={10} flexWrap="wrap">
          {availableSlots.length === 0 ? (
            <Text fontFamily={"$js4"} fontSize={"$4"} color={themeColors.onyx}>
              No slots available for this date.
            </Text>
          ) : (
            availableSlots.map((slot) => (
              <Button
                key={slot.value}
                fontFamily={"$js4"}
                fontSize={"$4"}
                backgroundColor={
                  selectedSlot === slot.value ? themeColors.accent : undefined
                }
                textProps={{
                  color:
                    selectedSlot === slot.value
                      ? themeColors.plat
                      : themeColors.onyx,
                  fontWeight: "bold",
                }}
                onPress={() => {
                  setSelectedSlot(slot.value);
                }}
              >
                {slot.label}
              </Button>
            ))
          )}
        </XStack>
      </YStack>
      <Button
        marginTop={50}
        fontFamily={"$js4"}
        fontSize={"$4"}
        backgroundColor={!selectedSlot ? undefined : themeColors.accent}
        textProps={{
          color: !selectedSlot ? themeColors.onyx : themeColors.light,
          fontWeight: "bold",
        }}
        disabled={!selectedSlot}
        onPress={async () => {
          if (selectedSlot) {
            const booking = await BookingService.addBooking({
              date: selectedDate,
              slot: selectedSlot as SlotTime,
              phoneNumber: user?.phoneNumber || "",
            });
            if (booking) {
              toast({
                title: "Booking Confirmed",
                preset: "done",
                duration: 5,
              });
            } else {
              toast({
                title: "Booking Failed",
                message: "Please try again later.",
                preset: "error",
                duration: 5,
              });
            }
            onClose();
            console.log(
              `Booking confirmed for ${selectedDate.toLocaleDateString()} at ${selectedSlot}`
            );
          } else {
            console.warn("Please select a slot.");
          }
        }}
      >
        Confirm Booking
      </Button>
    </View>
  );
};

const UserBooking = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    const unsubscribe = BookingService.onBookingUpdate((data) => {
      setBookings(data);
    }, user?.phoneNumber || "");
    return () => {
      unsubscribe();
    };
  }, []);

  if (!bookings || bookings.length === 0) {
    return <BookingForm currentBookings={bookings} onClose={() => {}} />;
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: themeColors.plat }}>
      <BookingList bookings={bookings} />
      <DrawerSheet<void>
        FC={({ setOpen }) => (
          <FloatingRoundButton onPress={() => setOpen(true)} />
        )}
        Child={({ onClose }) => (
          <BookingForm onClose={onClose} currentBookings={bookings} />
        )}
        onClose={async (data) => {}}
      ></DrawerSheet>
    </View>
  );
};

export const BookingScreen = () => {
  const { role } = useAuth();

  if (role === Role.USER) {
    return <UserBooking />;
  } else {
    return <AdminBookingList />;
  }
};
