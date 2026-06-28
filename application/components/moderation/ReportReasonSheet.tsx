import { LoginPrimaryButton } from "@/components/auth/login/LoginPrimaryButton";
import {
  VitalityDrawerFooter,
  VitalityDrawerSheet,
} from "@/components/common/VitalityDrawerSheet";
import { VitalityDrawerHeader } from "@/components/common/VitalityDrawerHeader";
import { UserInfo } from "@/components/common/UserList";
import { ReportReason } from "@/constants/moderation";
import { useVitalityFonts } from "@/hooks/useVitalityFonts";
import { UserProfile } from "@/services/Auth.service";
import { UserService } from "@/services/User.service";
import {
  loginColors,
  loginRadius,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { PostContentField } from "../posts/create/PostContentField";
import { ReportReasonSelect } from "./ReportReasonSelect";

type ReportReasonSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  showDoctorPicker?: boolean;
  onSubmit: (
    reason: ReportReason,
    details?: string,
    reportedUserId?: string,
  ) => Promise<boolean>;
};

export const ReportReasonSheet: FC<ReportReasonSheetProps> = ({
  open,
  onOpenChange,
  title,
  showDoctorPicker = false,
  onSubmit,
}) => (
  <VitalityDrawerSheet<void>
    open={open}
    onOpenChange={onOpenChange}
    frameBackgroundColor={loginColors.surfaceContainerLowest}
    Child={({ onClose }) => (
      <ReportReasonForm
        open={open}
        title={title}
        showDoctorPicker={showDoctorPicker}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    )}
  />
);

const ReportReasonForm = ({
  open,
  title,
  showDoctorPicker,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  showDoctorPicker: boolean;
  onClose: () => void;
  onSubmit: (
    reason: ReportReason,
    details?: string,
    reportedUserId?: string,
  ) => Promise<boolean>;
}) => {
  const fontsLoaded = useVitalityFonts();
  const [reason, setReason] = useState<ReportReason | "">("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [doctors, setDoctors] = useState<UserProfile[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

  useEffect(() => {
    if (!showDoctorPicker) return;
    UserService.getDoctors().then(setDoctors);
  }, [showDoctorPicker]);

  useEffect(() => {
    if (!open) return;
    setSelectedDoctorId("");
    setReason("");
    setDetails("");
  }, [open]);

  if (!fontsLoaded) {
    return null;
  }

  const doctorSelected = !showDoctorPicker || selectedDoctorId.length > 0;
  const canSubmit =
    doctorSelected &&
    reason !== "" &&
    (reason !== "other" || details.trim().length > 0) &&
    !submitting;

  return (
    <View style={styles.formRoot}>
      <VitalityDrawerHeader title={title} onClose={onClose} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.description}>
          Reports are sent to the clinic administrator for review.
        </Text>
        {showDoctorPicker ? (
          <>
            <Text style={styles.sectionLabel}>Select doctor to report</Text>
            {doctors.length === 0 ? (
              <Text style={styles.empty}>No doctors available.</Text>
            ) : (
              doctors.map((doctor) => (
                <Pressable
                  key={doctor.id}
                  onPress={() => setSelectedDoctorId(doctor.id)}
                  style={[
                    styles.doctorRow,
                    selectedDoctorId === doctor.id && styles.doctorRowSelected,
                  ]}
                >
                  <UserInfo user={doctor} />
                </Pressable>
              ))
            )}
          </>
        ) : null}
        <ReportReasonSelect
          value={reason}
          onValueChange={setReason}
          required
        />
        {reason === "other" ? (
          <PostContentField
            label="Details"
            value={details}
            onChangeText={setDetails}
            placeholder="Describe the issue"
            maxLength={500}
          />
        ) : null}
      </ScrollView>
      <VitalityDrawerFooter backgroundColor={loginColors.surfaceContainerLowest}>
        <LoginPrimaryButton
          label="Submit report"
          loadingLabel="Submitting..."
          disabled={!canSubmit}
          loading={submitting}
          style={styles.submitButton}
          onPress={async () => {
            if (!canSubmit || !reason) return;
            setSubmitting(true);
            try {
              const success = await onSubmit(
                reason,
                reason === "other" ? details.trim() : undefined,
                showDoctorPicker ? selectedDoctorId : undefined,
              );
              if (success) {
                onClose();
              }
            } finally {
              setSubmitting(false);
            }
          }}
        />
      </VitalityDrawerFooter>
    </View>
  );
};

const styles = StyleSheet.create({
  formRoot: {
    flexShrink: 1,
    maxHeight: "100%",
  },
  scrollContent: {
    paddingHorizontal: loginSpacing.containerMargin,
    paddingBottom: loginSpacing.stackMd,
  },
  description: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurfaceVariant,
    marginBottom: loginSpacing.stackMd,
  },
  sectionLabel: {
    ...loginTypography.labelMd,
    color: loginColors.onSurfaceVariant,
    marginBottom: loginSpacing.stackSm,
  },
  empty: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurfaceVariant,
    textAlign: "center",
    marginBottom: loginSpacing.stackMd,
  },
  doctorRow: {
    borderRadius: loginRadius.md,
    borderWidth: 1,
    borderColor: loginColors.outlineVariant,
    marginBottom: loginSpacing.stackSm,
    overflow: "hidden",
  },
  doctorRowSelected: {
    borderColor: loginColors.secondary,
    borderWidth: 2,
    backgroundColor: loginColors.surfaceContainerLow,
  },
  submitButton: {
    marginTop: 0,
  },
});
