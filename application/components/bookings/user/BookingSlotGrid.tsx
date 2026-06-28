import { SlotTime } from "@/services/Booking.service";
import {
  loginColors,
  loginRadius,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type SlotOption = { label: string; value: SlotTime };

type BookingSlotGridProps = {
  slots: SlotOption[];
  onSelectSlot: (value: SlotTime) => void;
  selectedSlot?: string;
  selectedSlots?: SlotTime[];
  unavailableSlots?: SlotTime[];
  sectionTitle?: string;
  emptyMessage?: string;
  compact?: boolean;
};

export const BookingSlotGrid: FC<BookingSlotGridProps> = ({
  slots,
  selectedSlot = "",
  selectedSlots,
  unavailableSlots = [],
  onSelectSlot,
  sectionTitle = "AVAILABLE SLOTS",
  emptyMessage = "No slots available for this date.",
  compact,
}) => (
  <View style={[styles.section, compact && styles.sectionCompact]}>
    <Text style={styles.sectionTitle}>{sectionTitle}</Text>
    {slots.length === 0 ? (
      <Text style={styles.empty}>{emptyMessage}</Text>
    ) : (
      <View style={styles.grid}>
        {slots.map((slot) => {
          const isUnavailable = unavailableSlots.includes(slot.value);
          const selected = selectedSlots
            ? selectedSlots.includes(slot.value)
            : selectedSlot === slot.value;

          return (
            <Pressable
              key={slot.value}
              disabled={isUnavailable}
              onPress={() => onSelectSlot(slot.value)}
              style={styles.pressable}
            >
              {({ pressed }) => (
                <View
                  style={[
                    styles.slot,
                    selected && styles.slotSelected,
                    isUnavailable && styles.slotUnavailable,
                    pressed && !isUnavailable && styles.slotPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.slotText,
                      selected && styles.slotTextSelected,
                      isUnavailable && styles.slotTextUnavailable,
                    ]}
                  >
                    {slot.label}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    )}
  </View>
);

const SLOT_WIDTH_PERCENT = "31%";

const styles = StyleSheet.create({
  section: {
    marginTop: loginSpacing.stackLg,
  },
  sectionCompact: {
    marginTop: 0,
  },
  sectionTitle: {
    ...loginTypography.labelMd,
    color: loginColors.onSurfaceVariant,
    letterSpacing: 1,
    marginBottom: loginSpacing.stackMd,
  },
  empty: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurfaceVariant,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: loginSpacing.stackSm,
  },
  pressable: {
    width: SLOT_WIDTH_PERCENT,
  },
  slot: {
    width: "100%",
    paddingVertical: loginSpacing.stackMd,
    paddingHorizontal: loginSpacing.stackSm,
    borderRadius: loginRadius.md,
    borderWidth: 1,
    borderColor: loginColors.outlineVariant,
    alignItems: "center",
    backgroundColor: loginColors.surfaceContainerLowest,
  },
  slotSelected: {
    borderWidth: 2,
    borderColor: loginColors.secondary,
    backgroundColor: "rgba(137, 246, 166, 0.15)",
  },
  slotUnavailable: {
    backgroundColor: loginColors.surfaceContainerLowest,
    borderColor: loginColors.outlineVariant,
    opacity: 0.25,
  },
  slotPressed: {
    transform: [{ scale: 0.95 }],
  },
  slotText: {
    ...loginTypography.labelMd,
    color: loginColors.onSurface,
    textAlign: "center",
  },
  slotTextSelected: {
    color: loginColors.secondary,
  },
  slotTextUnavailable: {
    color: loginColors.onSurfaceVariant,
  },
});
