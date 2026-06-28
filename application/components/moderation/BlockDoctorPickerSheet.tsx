import { LoginPrimaryButton } from "@/components/auth/login/LoginPrimaryButton";
import {
  VitalityDrawerFooter,
  VitalityDrawerSheet,
} from "@/components/common/VitalityDrawerSheet";
import { VitalityDrawerHeader } from "@/components/common/VitalityDrawerHeader";
import { UserInfo } from "@/components/common/UserList";
import { useVitalityFonts } from "@/hooks/useVitalityFonts";
import { UserProfile } from "@/services/Auth.service";
import { ModerationService } from "@/services/Moderation.service";
import { UserService } from "@/services/User.service";
import {
  loginColors,
  loginRadius,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { toast } from "burnt";
import { FC, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type BlockDoctorPickerSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blockerId: string;
  chatId: string;
};

export const BlockDoctorPickerSheet: FC<BlockDoctorPickerSheetProps> = ({
  open,
  onOpenChange,
  blockerId,
  chatId,
}) => (
  <VitalityDrawerSheet<void>
    open={open}
    onOpenChange={onOpenChange}
    frameBackgroundColor={loginColors.surfaceContainerLowest}
    Child={({ onClose }) => (
      <BlockDoctorPickerForm
        blockerId={blockerId}
        chatId={chatId}
        onClose={onClose}
      />
    )}
  />
);

const BlockDoctorPickerForm = ({
  blockerId,
  chatId,
  onClose,
}: {
  blockerId: string;
  chatId: string;
  onClose: () => void;
}) => {
  const fontsLoaded = useVitalityFonts();
  const [doctors, setDoctors] = useState<UserProfile[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    UserService.getDoctors().then(setDoctors);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.formRoot}>
      <VitalityDrawerHeader title="Block Doctor" onClose={onClose} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.description}>
          Choose which clinic number you want to block. You can still message
          other doctors at the clinic.
        </Text>
        {doctors.length === 0 ? (
          <Text style={styles.empty}>No doctors available.</Text>
        ) : (
          doctors.map((doctor) => (
            <Pressable
              key={doctor.id}
              onPress={() => setSelectedId(doctor.id)}
              style={[
                styles.row,
                selectedId === doctor.id && styles.rowSelected,
              ]}
            >
              <UserInfo user={doctor} />
            </Pressable>
          ))
        )}
      </ScrollView>
      {doctors.length > 0 ? (
        <VitalityDrawerFooter
          backgroundColor={loginColors.surfaceContainerLowest}
        >
          <LoginPrimaryButton
            label="Block doctor"
            loadingLabel="Blocking..."
            disabled={!selectedId || submitting}
            loading={submitting}
            style={styles.submitButton}
            onPress={async () => {
              if (!selectedId || submitting) return;
              setSubmitting(true);
              try {
                const success = await ModerationService.blockUser(
                  blockerId,
                  selectedId,
                  chatId,
                );
                if (success) {
                  toast({ title: "Doctor blocked", preset: "done" });
                  onClose();
                } else {
                  toast({
                    title: "Could not block doctor",
                    preset: "error",
                  });
                }
              } finally {
                setSubmitting(false);
              }
            }}
          />
        </VitalityDrawerFooter>
      ) : null}
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
  empty: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurfaceVariant,
    textAlign: "center",
    marginTop: loginSpacing.stackLg,
  },
  row: {
    borderRadius: loginRadius.md,
    borderWidth: 1,
    borderColor: loginColors.outlineVariant,
    marginBottom: loginSpacing.stackSm,
    overflow: "hidden",
  },
  rowSelected: {
    borderColor: loginColors.secondary,
    borderWidth: 2,
    backgroundColor: loginColors.surfaceContainerLow,
  },
  submitButton: {
    marginTop: 0,
  },
});
