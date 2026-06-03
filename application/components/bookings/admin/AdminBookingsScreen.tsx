import { LoaderScreen } from "@/components/LoaderScreen";
import { useVitalityFonts } from "@/hooks/useVitalityFonts";
import { BookingService, BookingType } from "@/services/Booking.service";
import {
  loginColors,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { BookingDateStrip } from "../user/BookingDateStrip";
import {
  getAdminBookingDateRange,
  getDefaultAdminBookingDate,
  isSameCalendarDay,
} from "../user/bookingDateUtils";
import { AdminBookingList } from "./AdminBookingList";
import { AdminSlotActions } from "./AdminSlotActions";

export const AdminBookingsScreen: FC = () => {
  const fontsLoaded = useVitalityFonts();
  const [selectedDate, setSelectedDate] = useState(getDefaultAdminBookingDate);
  const [bookings, setBookings] = useState<BookingType[]>([]);

  useEffect(() => {
    const unsub = BookingService.onBookingUpdate((data) => {
      setBookings(data);
    });
    return unsub;
  }, []);

  if (!fontsLoaded) {
    return <LoaderScreen />;
  }

  const filtered = bookings.filter((booking) =>
    isSameCalendarDay(booking.date, selectedDate),
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.pageTitle}>Appointments</Text>
      <BookingDateStrip
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        dateRange={getAdminBookingDateRange()}
        isFirstSection
      />
      <AdminSlotActions selectedDate={selectedDate} />
      <AdminBookingList bookings={filtered} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: loginColors.background,
  },
  content: {
    paddingHorizontal: loginSpacing.containerMargin,
    paddingVertical: loginSpacing.stackLg,
    paddingBottom: loginSpacing.sectionGap,
  },
  pageTitle: {
    ...loginTypography.headlineLgMobile,
    color: loginColors.onSurface,
    marginBottom: loginSpacing.stackSm,
  },
});
