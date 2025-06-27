import {
  BookingService,
  BookingType,
  SlotTime,
} from "@/services/Booking.service";
import { themeColors } from "@/themes/themes";
import { FC, useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Input, Text, XStack, YStack } from "tamagui";
import { DateTimePicker } from "../common/DateTimePicker";
import { renderRightActions } from "../common/DeleteRightAction";
import { MomentService } from "@/services/Moment.service";
import { toast } from "burnt";

const BookingCard = ({ item }: { item: BookingType }) => {
  const ref = useRef<any>(null);
  return (
    <Swipeable
      ref={ref}
      renderRightActions={() =>
        renderRightActions(async () => {
          // Handle delete action here
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
          <XStack gap={5} alignItems="center">
            <Text fontFamily={"$js5"} color={themeColors.plat} fontSize={24}>
              {item.date.toLocaleDateString()} {item.slot}
            </Text>
          </XStack>
          <Text fontFamily={"$js4"} color={themeColors.plat} fontSize={16}>
            {item.phoneNumber}
          </Text>
        </YStack>
      </XStack>
    </Swipeable>
  );
};

export const BookingList: FC<{
  bookings: BookingType[];
  searchToken?: string;
}> = ({ bookings, searchToken = "" }) => {
  return (
    <FlatList
      data={bookings
        .filter((booking) => booking.phoneNumber.includes(searchToken))
        .sort((a, b) => {
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
        searchToken={searchToken}
      />
    </View>
  );
};
