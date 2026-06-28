import { ReportReason, REPORT_REASON_OPTIONS } from "@/constants/moderation";
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

type ReportReasonSelectProps = {
  value: ReportReason | "";
  onValueChange: (value: ReportReason) => void;
  required?: boolean;
};

export const ReportReasonSelect: FC<ReportReasonSelectProps> = ({
  value,
  onValueChange,
  required,
}) => {
  const [open, setOpen] = useState(false);
  const selectedLabel =
    REPORT_REASON_OPTIONS.find((o) => o.value === value)?.label ??
    "Select reason";

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Reason
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <Pressable style={styles.trigger} onPress={() => setOpen(true)}>
        <Text
          style={[styles.triggerText, !value && styles.triggerPlaceholder]}
        >
          {selectedLabel}
        </Text>
        <MaterialIcons
          name="arrow-drop-down"
          size={24}
          color={loginColors.onSurfaceVariant}
        />
      </Pressable>
      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            {REPORT_REASON_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  value === option.value && styles.optionSelected,
                ]}
                onPress={() => {
                  onValueChange(option.value);
                  setOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    value === option.value && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {value === option.value ? (
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: loginSpacing.stackMd,
  },
  label: {
    ...loginTypography.labelMd,
    color: loginColors.onSurfaceVariant,
    marginBottom: loginSpacing.stackSm,
  },
  required: {
    color: loginColors.error,
  },
  trigger: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: loginColors.outline,
    borderRadius: loginRadius.md,
    backgroundColor: loginColors.surfaceContainerLowest,
    paddingHorizontal: loginSpacing.stackMd,
  },
  triggerText: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurface,
  },
  triggerPlaceholder: {
    color: loginColors.outlineVariant,
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
  optionText: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurface,
  },
  optionTextSelected: {
    fontFamily: "Manrope_600SemiBold",
    color: loginColors.secondary,
  },
});
