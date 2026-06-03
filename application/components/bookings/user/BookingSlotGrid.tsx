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
  selectedSlot: string;
  onSelectSlot: (value: SlotTime) => void;
};

export const BookingSlotGrid: FC<BookingSlotGridProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>AVAILABLE SLOTS</Text>
    {slots.length === 0 ? (
      <Text style={styles.empty}>No slots available for this date.</Text>
    ) : (
      <View style={styles.grid}>
        {slots.map((slot) => {
          const selected = selectedSlot === slot.value;
          return (
            <Pressable
              key={slot.value}
              onPress={() => onSelectSlot(slot.value)}
              style={styles.pressable}
            >
              {({ pressed }) => (
                <View
                  style={[
                    styles.slot,
                    selected && styles.slotSelected,
                    pressed && styles.slotPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.slotText,
                      selected && styles.slotTextSelected,
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
});
