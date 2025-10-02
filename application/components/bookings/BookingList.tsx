import { BookingService, BookingType } from "@/services/Booking.service";
import { MomentService } from "@/services/Moment.service";
import { themeColors } from "@/themes/themes";
import { toast } from "burnt";
import { FC, useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Text, XStack, YStack } from "tamagui";
import { DateTimePicker } from "../common/DateTimePicker";
import { renderRightActions } from "../common/DeleteRightAction";
import { useAuth } from "../auth/hooks/useAuth";
import { Role } from "@/services/Firebase.service";

const BookingCard = ({ item }: { item: BookingType }) => {
  const ref = useRef<any>(null);
  const { role } = useAuth();

  if (item.cancelled) {
    return (
      <XStack
        style={{
          padding: 10,
          margin: 5,
          borderRadius: 5,
          backgroundColor: themeColors.onyx,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          fontFamily={"$js4"}
          color={themeColors.plat}
          fontSize={20}
          style={{ textDecorationLine: "line-through" }}
        >
          {item.date.toLocaleDateString()} {item.slot}
        </Text>
        <Text
          fontFamily={"$js4"}
          color={themeColors.plat}
          fontSize={16}
        >
          Cancelled
        </Text>
      </XStack>
    );
  }

  return (
    <Swipeable
      ref={ref}
      renderRightActions={() =>
        renderRightActions(async () => {
          if (role === Role.ADMIN || role === Role.DOCTOR) {
            const res = await BookingService.cancelBooking(item);
            if (res) {
              toast({
                title: "Booking Cancelled",
                preset: "done",
              });
            } else {
              toast({
                title: "Failed to cancel booking",
                preset: "error",
              });
            }
          } else {
            const res = await BookingService.deleteBooking(item.id as string);
            if (res) {
              toast({
                title: "Booking Deleted",
                preset: "done",
              });
            } else {
              toast({
                title: "Failed to delete booking",
                preset: "error",
              });
            }
          }
          console.log(
            `Delete booking for ${item.date.toLocaleDateString()} at ${
              item.slot
            }`
          );
        })
      }
    >
      <XStack
        style={{
          padding: 10,
          margin: 5,
          borderRadius: 5,
          backgroundColor: themeColors.accent,
          justifyContent: "space-between",
        }}
      >
        <YStack gap={5} justifyContent="space-between">
          <XStack gap={5} justifyContent="space-between" width={"100%"}>
            <Text fontFamily={"$js4"} color={themeColors.plat} fontSize={20}>
              {item.date.toLocaleDateString()} {item.slot}
            </Text>
            <Text fontFamily={"$js4"} color={themeColors.plat} fontSize={16}>
              {item.phoneNumber}
            </Text>
          </XStack>

          <Text fontFamily={"$js4"} color={themeColors.plat} fontSize={16}>
            {item.person.name}, {item.person.age}, {item.person.sex}
          </Text>
        </YStack>
      </XStack>
    </Swipeable>
  );
};

export const BookingList: FC<{
  bookings: BookingType[];
}> = ({ bookings }) => {
  if (bookings.length === 0) {
    return (
      <YStack alignItems="center" marginTop={50}>
        <Text fontFamily={"$js4"} fontSize={"$4"} color={themeColors.onyx}>
          No bookings for this date.
        </Text>
      </YStack>
    );
  }
  return (
    <FlatList
      data={bookings.sort((a, b) => {
        return a.date.getTime() - b.date.getTime();
      })}
      keyExtractor={(item) =>
        item.date.getTime() + item.slot + item.phoneNumber
      }
      renderItem={({ item }) => <BookingCard item={item} />}
    />
  );
};

export const AdminBookingList = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchToken, setSearchToken] = useState<string>("");
  const [bookings, setBookings] = useState<any[]>([]);
  useEffect(() => {
    const unsub = BookingService.onBookingUpdate((data) => {
      setBookings(data);
    });
    return () => {
      unsub();
    };
  }, []);
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <YStack gap={20} marginBottom={20}>
        <Text fontFamily={"$js4"} fontSize={"$4"} color={themeColors.onyx}>
          Booking Date
        </Text>
        <DateTimePicker
          minDate={new Date()}
          mode="date"
          maxDate={new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)}
          onChange={(date) => {
            setSelectedDate(date);
          }}
          value={selectedDate}
        />
      </YStack>
      <BookingList
        bookings={bookings.filter((booking) => {
          return (
            MomentService.getDDMMMYYY(booking.date) ===
            MomentService.getDDMMMYYY(selectedDate)
          );
        })}
      />
    </View>
  );
};
