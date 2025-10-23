import {
  BookingService,
  BookingType,
  slots,
  SlotTime,
} from "@/services/Booking.service";
import { MomentService } from "@/services/Moment.service";
import { themeColors } from "@/themes/themes";
import { toast } from "burnt";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Input, ScrollView, Text, XStack, YStack } from "tamagui";
import { useAuth } from "../auth/hooks/useAuth";
import { DateTimePicker } from "../common/DateTimePicker";
import { DrawerSheet } from "../common/DrawerSheet";
import { FloatingRoundButton } from "../common/FloatingRoundButton";
import { Dropdown } from "../common/Select";
import { AdminBookingList, BookingList } from "./BookingList";
import { Role } from "@/services/Firebase.service";



export const SlotButton = ({
  slot,
  isSelected,
  onPress,
}: {
  slot: { label: string; value: SlotTime };
  isSelected: boolean;
  onPress: () => void;
}) => {
  return (
    <Button
      fontFamily={"$js4"}
      fontSize={"$4"}
      backgroundColor={isSelected ? themeColors.accent : undefined}
      textProps={{
        color: isSelected ? themeColors.plat : themeColors.onyx,
        fontWeight: "bold",
      }}
      onPress={onPress}
    >
      {slot.label}
    </Button>
  );
};

const BookingForm = ({
  onClose,
  currentBookings,
}: {
  onClose: () => void;
  currentBookings: BookingType[];
}) => {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [sex, setSex] = useState<string>("other");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<
    { label: string; value: SlotTime }[]
  >([]);
  const { user } = useAuth();

  useEffect(() => {
    BookingService.getBlockedSlots(selectedDate).then((blockedSlots) => {
      const allSlots = slots.filter((slot) => {
        const isBlocked = blockedSlots.some(
          (blockedSlot) => blockedSlot === slot.value
        );

        const isBooked = currentBookings.some(
          (booking) =>
            MomentService.getDDMMMYYY(booking.date) ===
              MomentService.getDDMMMYYY(selectedDate) &&
            booking.slot === slot.value
        );

        const isSlotExpired = MomentService.isSlotExpired(
          selectedDate,
          slot.value
        );
        return !isBlocked && !isBooked && !isSlotExpired;
      });
      setAvailableSlots(allSlots);
    });
  }, [selectedDate, currentBookings]);

  return (
    <ScrollView>
      <YStack
        gap={20}
        style={{
          padding: 20,
          flex: 1,
          backgroundColor: themeColors.plat,
          maxHeight: "80%",
          overflowY: "auto",
        }}
      >
        <YStack gap={10}>
          <Text fontFamily={"$js4"} fontSize={"$4"} color={themeColors.onyx}>
            Name
            <Text fontFamily={"$js4"} fontSize={"$4"} color={"red"}>
              *
            </Text>
          </Text>
          <Input
            fontFamily={"$js5"}
            fontSize={"$4"}
            defaultValue={""}
            maxLength={25}
            onChangeText={(text) => {
              setName(text);
            }}
          />
          <Text
            alignSelf="flex-end"
            fontFamily={"$js4"}
            fontSize={"$1"}
            color={themeColors.accent}
          >
            {name?.length || 0}/25
          </Text>
        </YStack>
        <YStack gap={10}>
          <Text fontFamily={"$js4"} fontSize={"$4"} color={themeColors.onyx}>
            Age
            <Text fontFamily={"$js4"} fontSize={"$4"} color={"red"}>
              *
            </Text>
          </Text>
          <Input
            fontFamily={"$js5"}
            fontSize={"$4"}
            keyboardType="numeric"
            value={age}
            defaultValue={""}
            maxLength={2}
            onChangeText={(text) => {
              if (Number(text)) {
                setAge(text);
              } else {
                setAge("");
              }
            }}
          />
        </YStack>
        <YStack gap={10}>
          <Text fontFamily={"$js4"} fontSize={"$4"} color={themeColors.onyx}>
            Sex
            <Text fontFamily={"$js4"} fontSize={"$4"} color={"red"}>
              *
            </Text>
          </Text>
          <Dropdown
            defaultValue="other"
            onValueChange={(value) => {
              console.log("Selected sex:", value);
              setSex(value);
            }}
            items={[
              { name: "Female", value: "female" },
              { name: "Male", value: "male" },
              { name: "Other", value: "other" },
            ]}
          />
        </YStack>
        <YStack gap={10}>
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
        <YStack gap={10}>
          <Text fontFamily={"$js4"} fontSize={"$4"} color={themeColors.onyx}>
            Select a Slot
            <Text fontFamily={"$js4"} fontSize={"$4"} color={"red"}>
              *
            </Text>
          </Text>
          <XStack gap={10} flexWrap="wrap" justifyContent="center">
            {availableSlots.length === 0 ? (
              <Text
                fontFamily={"$js4"}
                fontSize={"$4"}
                color={themeColors.onyx}
              >
                No slots available for this date.
              </Text>
            ) : (
              availableSlots.map((slot) => (
                <SlotButton
                  key={slot.value}
                  slot={slot}
                  isSelected={selectedSlot === slot.value}
                  onPress={() => {
                    setSelectedSlot(slot.value);
                  }}
                />
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
                person: {
                  name,
                  age,
                  sex,
                },
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
      </YStack>
    </ScrollView>
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
