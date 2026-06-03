import {
  loginColors,
  loginRadius,
  loginShadow,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  formatDayNumber,
  formatWeekdayShort,
  getBookingDateRange,
  isSameCalendarDay,
} from "./bookingDateUtils";

type BookingDateStripProps = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  dateRange?: Date[];
  isFirstSection?: boolean;
};

export const BookingDateStrip: FC<BookingDateStripProps> = ({
  selectedDate,
  onSelectDate,
  dateRange,
  isFirstSection,
}) => {
  const days = dateRange ?? getBookingDateRange();

  return (
    <View
      style={[
        styles.section,
        isFirstSection && styles.sectionFirst,
      ]}
    >
      <Text style={styles.sectionTitle}>SELECT DATE</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}
      >
        {days.map((date) => {
          const selected = isSameCalendarDay(date, selectedDate);
          return (
            <Pressable
              key={date.toISOString()}
              onPress={() => onSelectDate(date)}
            >
              {({ pressed }) => (
                <View
                  style={[
                    styles.card,
                    selected && styles.cardSelected,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.weekday,
                      selected && styles.weekdaySelected,
                    ]}
                  >
                    {formatWeekdayShort(date)}
                  </Text>
                  <Text
                    style={[styles.dayNum, selected && styles.dayNumSelected]}
                  >
                    {formatDayNumber(date)}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: loginSpacing.sectionGap,
  },
  sectionFirst: {
    marginTop: loginSpacing.stackLg,
  },
  sectionTitle: {
    ...loginTypography.labelMd,
    color: loginColors.onSurfaceVariant,
    letterSpacing: 1,
    marginBottom: loginSpacing.stackMd,
  },
  strip: {
    paddingBottom: loginSpacing.stackSm,
    gap: loginSpacing.stackMd,
  },
  card: {
    width: 64,
    height: 80,
    borderRadius: loginRadius.lg,
    borderWidth: 1,
    borderColor: loginColors.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: loginColors.surfaceContainerLowest,
  },
  cardSelected: {
    backgroundColor: loginColors.primaryContainer,
    borderColor: loginColors.primaryContainer,
    ...loginShadow.button,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.95 }],
  },
  weekday: {
    ...loginTypography.labelSm,
    color: loginColors.onSurfaceVariant,
  },
  weekdaySelected: {
    color: loginColors.onPrimaryFixed,
  },
  dayNum: {
    ...loginTypography.headlineMd,
    color: loginColors.onSurface,
  },
  dayNumSelected: {
    color: loginColors.onPrimary,
  },
});
