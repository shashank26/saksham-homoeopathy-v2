import { BookingService, slots, SlotTime } from "@/services/Booking.service";
import { SlotButton } from "../Bookings";
import { useEffect, useState } from "react";
import { Button, XStack, YStack, Text, View } from "tamagui";
import { themeColors } from "@/themes/themes";
import { DrawerSheet } from "../../common/DrawerSheet";
import { toast } from "burnt";

export const SlotBlocker = ({ selectedDate }: { selectedDate: Date }) => {
  return (
    <DrawerSheet<Boolean>
      FC={({ setOpen }: any) => (
        <Button
          fontFamily={"$js4"}
          fontSize={"$4"}
          backgroundColor={themeColors.accent}
          textProps={{
            color: themeColors.plat,
            fontWeight: "bold",
          }}
          onPress={() => {
            setOpen(true);
          }}
        >
          Block Slots
        </Button>
      )}
      Child={({ onClose }: { onClose: (data: Boolean) => void }) => (
        <SlotBlockerForm selectedDate={selectedDate} onClose={onClose} />
      )}
      onClose={async (data) => {}}
    ></DrawerSheet>
  );
};

const SlotBlockerForm = ({
  selectedDate,
  onClose,
}: {
  selectedDate: Date;
  onClose: (data: Boolean) => void;
}) => {
  const [selectedSlots, setSelectedSlots] = useState<SlotTime[]>([]);
  const [availableSlots, setAvailableSlots] = useState<
    { label: string; value: SlotTime }[]
  >([]);
  useEffect(() => {
    const unsubscribe = BookingService.getBlockedSlotsUpdate(
      selectedDate,
      (blockedSlots) => {
        setAvailableSlots(slots.filter((s) => !blockedSlots.includes(s.value)));
      }
    );
    return () => {
      unsubscribe();
    };
  }, [selectedDate]);
  return (
    <View marginVertical={20}>
      <YStack gap={20} marginHorizontal={10}>
        <Text fontFamily={"$js5"} fontSize={"$5"}>
          {selectedDate.toDateString()}
        </Text>
        <Button
          backgroundColor={themeColors.onyx}
          onPress={() => {
            if (selectedSlots.length === slots.length) {
              setSelectedSlots([]);
            } else {
              setSelectedSlots(slots.map((s) => s.value));
            }
          }}
        >
          <Text fontFamily={"$js5"} fontSize={"$4"} color={"white"}>
            {selectedSlots.length === availableSlots.length
              ? "Unselect All Slots"
              : "Select All Slots"}
          </Text>
        </Button>

        <XStack gap={10} flexWrap="wrap">
          {availableSlots.map((slot) => {
            return (
              <SlotButton
                key={slot.value}
                isSelected={selectedSlots.includes(slot.value)}
                onPress={() => {
                  if (selectedSlots.includes(slot.value)) {
                    setSelectedSlots(
                      selectedSlots.filter((s) => s !== slot.value)
                    );
                  } else {
                    setSelectedSlots([...selectedSlots, slot.value]);
                  }
                }}
                slot={slot}
              />
            );
          })}
        </XStack>
        <Button
          disabled={selectedSlots.length === 0}
          disabledStyle={{ backgroundColor: themeColors.onyx + "80" }}
          onPress={() => {
            BookingService.blockBooking(selectedDate, selectedSlots);
            onClose(true);
            toast({
              preset: "done",
              title: "Slots Blocked Successfully",
            });
          }}
        >
          Block slots
        </Button>
      </YStack>
    </View>
  );
};
