import { LoaderScreen } from "@/components/LoaderScreen";
import { useAuth } from "@/components/auth/hooks/useAuth";
import { useVitalityFonts } from "@/hooks/useVitalityFonts";
import { BookingService, BookingType } from "@/services/Booking.service";
import {
  loginColors,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { BookingForm } from "./BookingForm";
import { UserBookingList } from "./UserBookingList";

export const UserBookingsScreen: FC = () => {
  const fontsLoaded = useVitalityFonts();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!user?.phoneNumber) return;
    const unsubscribe = BookingService.onBookingUpdate((data) => {
      setBookings(data);
    }, user.phoneNumber);
    return unsubscribe;
  }, [user?.phoneNumber]);

  if (!fontsLoaded) {
    return <LoaderScreen />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.pageTitle}>Book Appointment</Text>
        <BookingForm
          onSuccess={() => {
            scrollRef.current?.scrollToEnd({ animated: true });
          }}
        />
        <UserBookingList bookings={bookings} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: loginColors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: loginSpacing.containerMargin,
    paddingVertical: loginSpacing.stackLg,
    paddingBottom: loginSpacing.sectionGap,
  },
  pageTitle: {
    ...loginTypography.headlineLgMobile,
    color: loginColors.onSurface,
    marginBottom: loginSpacing.stackLg,
  },
});
