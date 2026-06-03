import { MomentService } from "@/services/Moment.service";
import {
  loginColors,
  loginRadius,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { MaterialIcons } from "@expo/vector-icons";
import { FC, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import DatePicker from "react-native-date-picker";

type MedicineDateFieldProps = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  required?: boolean;
  icon?: "calendar-today" | "event";
};

export const MedicineDateField: FC<MedicineDateFieldProps> = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  required,
  icon = "calendar-today",
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <Pressable onPress={() => setOpen(true)}>
        {({ pressed }) => (
          <View style={[styles.field, pressed && styles.fieldPressed]}>
            <Text style={styles.value} numberOfLines={1}>
              {MomentService.getDDMMMYYY(value)}
            </Text>
            <MaterialIcons
              name={icon}
              size={20}
              color={loginColors.outline}
            />
          </View>
        )}
      </Pressable>
      <DatePicker
        mode="date"
        modal
        open={open}
        date={value}
        minimumDate={minDate}
        maximumDate={maxDate}
        onConfirm={(date) => {
          onChange(new Date(date));
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    ...loginTypography.labelMd,
    color: loginColors.onSurfaceVariant,
    marginBottom: loginSpacing.stackSm,
  },
  required: {
    color: loginColors.error,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 48,
    borderWidth: 1,
    borderColor: loginColors.outlineVariant,
    borderRadius: loginRadius.md,
    backgroundColor: loginColors.surface,
    paddingHorizontal: loginSpacing.stackMd,
    paddingVertical: 12,
  },
  fieldPressed: {
    borderColor: loginColors.primaryContainer,
    borderWidth: 2,
  },
  value: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurface,
    flex: 1,
    marginRight: loginSpacing.stackSm,
  },
});
