import { LoginPrimaryButton } from "@/components/auth/login/LoginPrimaryButton";
import { BookingTextField } from "@/components/bookings/user/BookingTextField";
import { FloatingRoundButton } from "@/components/common/FloatingRoundButton";
import { VitalityDrawerHeader } from "@/components/common/VitalityDrawerHeader";
import {
  VitalityDrawerFooter,
  VitalityDrawerSheet,
} from "@/components/common/VitalityDrawerSheet";
import { useVitalityFonts } from "@/hooks/useVitalityFonts";
import { UserProfile } from "@/services/Auth.service";
import { HistoryService, MedicineType } from "@/services/History.service";
import { loginColors, loginSpacing } from "@/themes/loginDesign";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { MedicineDateField } from "./MedicineDateField";

const medicineFormValid = (
  medicineForm: Partial<MedicineType>,
): MedicineType | false => {
  if (
    !medicineForm.name ||
    !medicineForm.dosage ||
    !medicineForm.startDate ||
    !medicineForm.endDate
  ) {
    return false;
  }

  if (medicineForm.startDate > medicineForm.endDate) {
    return false;
  }
  return medicineForm as MedicineType;
};

const MedicineForm = ({
  onClose,
  user,
}: {
  onClose: (data: void) => void;
  user: UserProfile;
}) => {
  const fontsLoaded = useVitalityFonts();
  const [loading, setLoading] = useState(false);
  const [medicineForm, setMedicineForm] = useState<Partial<MedicineType>>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const dismiss = () => onClose();
  const isValid = medicineFormValid(medicineForm) !== false;

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.formRoot}>
      <VitalityDrawerHeader title="Add Medicine" onClose={dismiss} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BookingTextField
          label="Medicine Name"
          value={medicineForm.name ?? ""}
          onChangeText={(text) =>
            setMedicineForm((prev) => ({ ...prev, name: text }))
          }
          placeholder="e.g. Rhus Tox 30"
          required
          maxLength={50}
          showCount
        />
        <BookingTextField
          label="Dosage"
          value={medicineForm.dosage ?? ""}
          onChangeText={(text) =>
            setMedicineForm((prev) => ({ ...prev, dosage: text }))
          }
          placeholder="e.g. 2 drops • Twice daily"
          required
          maxLength={50}
          showCount
        />
        <View style={styles.dateRow}>
          <View style={styles.dateColStart}>
            <MedicineDateField
              label="Prescribed Date"
              value={startDate}
              required
              icon="calendar-today"
              onChange={(date) => {
                setStartDate(date);
                setMedicineForm((prev) => {
                  const next = { ...prev, startDate: date };
                  if (prev.endDate && date > prev.endDate) {
                    setEndDate(date);
                    next.endDate = date;
                  }
                  return next;
                });
              }}
            />
          </View>
          <View style={styles.dateColEnd}>
            <MedicineDateField
              label="End Date"
              value={endDate}
              required
              icon="event"
              minDate={startDate}
              onChange={(date) => {
                setEndDate(date);
                setMedicineForm((prev) => ({ ...prev, endDate: date }));
              }}
            />
          </View>
        </View>
      </ScrollView>
      <VitalityDrawerFooter
        backgroundColor={loginColors.surfaceContainerLowest}
      >
        <LoginPrimaryButton
          label="Add Medicine"
          loadingLabel="Adding..."
          disabled={!isValid}
          loading={loading}
          style={styles.submitButton}
          onPress={async () => {
            const form = medicineFormValid(medicineForm);
            if (!form || !user.phoneNumber) return;
            setLoading(true);
            try {
              await HistoryService.addMedicine({
                ...form,
                phoneNumber: user.phoneNumber,
              });
              onClose();
            } catch (err) {
              console.log("Error adding medicine", err);
            } finally {
              setLoading(false);
            }
          }}
        />
      </VitalityDrawerFooter>
    </View>
  );
};

export const AddMedicine = ({ user }: { user: UserProfile }) => (
  <VitalityDrawerSheet<void>
    frameBackgroundColor={loginColors.surfaceContainerLowest}
    FC={({ setOpen }) => (
      <FloatingRoundButton onPress={() => setOpen(true)} />
    )}
    Child={({ onClose }) => <MedicineForm onClose={onClose} user={user} />}
    onClose={async () => {}}
  />
);

const styles = StyleSheet.create({
  formRoot: {
    flexShrink: 1,
    maxHeight: "100%",
  },
  scroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  scrollContent: {
    paddingHorizontal: loginSpacing.containerMargin,
    paddingBottom: loginSpacing.stackLg,
  },
  dateRow: {
    flexDirection: "row",
    marginBottom: loginSpacing.stackMd,
  },
  dateColStart: {
    flex: 1,
    marginRight: loginSpacing.stackMd,
  },
  dateColEnd: {
    flex: 1,
  },
  submitButton: {
    marginTop: 0,
  },
});
