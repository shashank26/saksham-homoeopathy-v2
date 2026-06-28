import { renderRightActions } from "@/components/common/DeleteRightAction";
import { BookingService, BookingType, slots } from "@/services/Booking.service";
import { MomentService } from "@/services/Moment.service";
import {
  loginColors,
  loginRadius,
  loginShadow,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { toast } from "burnt";
import { FC, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

function formatSlotLabel(slotValue: string): string {
  return slots.find((s) => s.value === slotValue)?.label ?? slotValue;
}

type AdminBookingCardProps = {
  item: BookingType;
};

export const AdminBookingCard: FC<AdminBookingCardProps> = ({ item }) => {
  const ref = useRef<Swipeable>(null);

  if (item.cancelled) {
    return (
      <View style={[styles.card, styles.cardCancelled]}>
        <Text style={[styles.dateTime, styles.strikethrough]}>
          {MomentService.getDDMMMYYY(item.date)} · {formatSlotLabel(item.slot)}
        </Text>
        <Text style={styles.phone}>{item.phoneNumber}</Text>
        <Text style={styles.patient}>
          {item.person.name}, {item.person.age} yrs ·{" "}
          {item.person.sex.charAt(0).toUpperCase() + item.person.sex.slice(1)}
        </Text>
        <Text style={styles.badgeCancelled}>Cancelled</Text>
      </View>
    );
  }

  return (
    <Swipeable
      ref={ref}
      renderRightActions={() =>
        renderRightActions(async () => {
          const res = await BookingService.cancelBooking(item);
          if (res) {
            toast({ title: "Booking Cancelled", preset: "done" });
          } else {
            toast({
              title: "Failed to cancel booking",
              preset: "error",
            });
          }
        })
      }
    >
      <View style={styles.card}>
        <Text style={styles.dateTime}>
          {MomentService.getDDMMMYYY(item.date)} · {formatSlotLabel(item.slot)}
        </Text>
        <Text style={styles.phone}>{item.phoneNumber}</Text>
        <Text style={styles.patient}>
          {item.person.name}, {item.person.age} yrs ·{" "}
          {item.person.sex.charAt(0).toUpperCase() + item.person.sex.slice(1)}
        </Text>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: loginColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: loginColors.outlineVariant,
    borderRadius: loginRadius.md,
    padding: loginSpacing.stackMd,
    marginBottom: loginSpacing.stackMd,
    ...loginShadow.card,
  },
  cardCancelled: {
    backgroundColor: loginColors.surfaceContainer,
    opacity: 0.85,
  },
  dateTime: {
    ...loginTypography.labelMd,
    color: loginColors.onSurface,
    marginBottom: loginSpacing.stackSm,
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
  phone: {
    ...loginTypography.labelMd,
    color: loginColors.primary,
    marginBottom: loginSpacing.stackSm,
  },
  patient: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurfaceVariant,
  },
  badgeCancelled: {
    ...loginTypography.labelSm,
    color: loginColors.onSurfaceVariant,
    marginTop: loginSpacing.stackSm,
  },
});
