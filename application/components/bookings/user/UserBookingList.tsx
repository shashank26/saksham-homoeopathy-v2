import { BookingType } from "@/services/Booking.service";
import {
  loginColors,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { UserBookingCard } from "./UserBookingCard";

type UserBookingListProps = {
  bookings: BookingType[];
};

export const UserBookingList: FC<UserBookingListProps> = ({ bookings }) => {
  const active = bookings
    .filter((b) => !b.cancelled)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (active.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Your Appointments</Text>
      {active.map((item) => (
        <UserBookingCard
          key={(item.id ?? "") + item.date.getTime() + item.slot}
          item={item}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: loginSpacing.sectionGap,
    paddingTop: loginSpacing.stackLg,
    borderTopWidth: 1,
    borderTopColor: loginColors.outlineVariant,
  },
  sectionTitle: {
    ...loginTypography.headlineMd,
    color: loginColors.onSurface,
    marginBottom: loginSpacing.stackMd,
  },
});
