import {
  PHONE_COUNTRIES,
  PhoneCountry,
} from "@/constants/phoneCountries";
import {
  loginColors,
  loginRadius,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FC, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CountryCodeSelectProps = {
  value: PhoneCountry;
  onValueChange: (country: PhoneCountry) => void;
  disabled?: boolean;
};

export const CountryCodeSelect: FC<CountryCodeSelectProps> = ({
  value,
  onValueChange,
  disabled,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        style={[styles.trigger, disabled && styles.triggerDisabled]}
        onPress={() => !disabled && setOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`Country code ${value.dialCode}, ${value.label}`}
      >
        <Text style={styles.triggerText}>{value.dialCode}</Text>
        <MaterialIcons
          name="arrow-drop-down"
          size={20}
          color={loginColors.onSurfaceVariant}
        />
      </Pressable>
      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Select country</Text>
            {PHONE_COUNTRIES.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.option,
                  value.id === option.id && styles.optionSelected,
                ]}
                onPress={() => {
                  onValueChange(option);
                  setOpen(false);
                }}
              >
                <View style={styles.optionLabel}>
                  <Text
                    style={[
                      styles.optionText,
                      value.id === option.id && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text style={styles.optionDialCode}>{option.dialCode}</Text>
                </View>
                {value.id === option.id ? (
                  <MaterialIcons
                    name="check"
                    size={20}
                    color={loginColors.secondary}
                  />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    minWidth: 72,
    height: 48,
    marginRight: loginSpacing.stackSm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: loginColors.outlineVariant,
    borderRadius: loginRadius.md,
    backgroundColor: loginColors.surfaceContainerLow,
    paddingHorizontal: loginSpacing.stackSm,
    gap: 2,
  },
  triggerDisabled: {
    opacity: 0.85,
  },
  triggerText: {
    ...loginTypography.labelMd,
    color: loginColors.onSurface,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: loginColors.surfaceContainerLowest,
    borderTopLeftRadius: loginRadius.lg,
    borderTopRightRadius: loginRadius.lg,
    paddingBottom: loginSpacing.stackLg,
  },
  sheetTitle: {
    ...loginTypography.headlineMd,
    color: loginColors.onSurface,
    paddingHorizontal: loginSpacing.containerMargin,
    paddingVertical: loginSpacing.stackMd,
    borderBottomWidth: 1,
    borderBottomColor: loginColors.outlineVariant,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: loginSpacing.stackMd,
    paddingHorizontal: loginSpacing.containerMargin,
    borderBottomWidth: 1,
    borderBottomColor: loginColors.outlineVariant,
  },
  optionSelected: {
    backgroundColor: loginColors.surfaceContainerLow,
  },
  optionLabel: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: loginSpacing.stackSm,
  },
  optionText: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurface,
  },
  optionTextSelected: {
    fontFamily: "Manrope_600SemiBold",
    color: loginColors.secondary,
  },
  optionDialCode: {
    ...loginTypography.labelSm,
    color: loginColors.onSurfaceVariant,
  },
});
