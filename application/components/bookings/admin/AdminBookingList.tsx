import { BookingType } from "@/services/Booking.service";
import {
  loginColors,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AdminBookingCard } from "./AdminBookingCard";

type AdminBookingListProps = {
  bookings: BookingType[];
};

export const AdminBookingList: FC<AdminBookingListProps> = ({ bookings }) => {
  const sorted = [...bookings].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Appointments</Text>
      {sorted.length === 0 ? (
        <Text style={styles.empty}>No bookings for this date.</Text>
      ) : (
        sorted.map((item) => (
          <AdminBookingCard
            key={(item.id ?? "") + item.date.getTime() + item.slot + item.phoneNumber}
            item={item}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: loginSpacing.stackLg,
  },
  sectionTitle: {
    ...loginTypography.headlineMd,
    color: loginColors.onSurface,
    marginBottom: loginSpacing.stackMd,
  },
  empty: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurfaceVariant,
    textAlign: "center",
    marginTop: loginSpacing.stackLg,
  },
});
