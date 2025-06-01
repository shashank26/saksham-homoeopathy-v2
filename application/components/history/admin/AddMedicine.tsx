import { DrawerSheet } from "@/components/common/DrawerSheet";
import { FloatingRoundButton } from "@/components/common/FloatingRoundButton";
import { LoaderButton } from "@/components/controls/LoaderButton";
import { UserProfile } from "@/services/Auth.service";
import { HistoryService, MedicineType } from "@/services/History.service";
import { themeColors } from "@/themes/themes";
import DTP from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Input, ScrollView, Text, View, XStack, YStack } from "tamagui";

const medicineFormValid = (
  medicineForm: Partial<MedicineType>
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
  const [medicineForm, setMedicineForm] = useState<Partial<MedicineType>>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  return (
    <ScrollView width={"100%"}>
      <YStack gap={10} marginBottom={50}>
        <YStack gap={5} alignItems="flex-start">
          <Text fontFamily={"$js4"} fontSize={"$4"} color={themeColors.onyx}>
            Name <Text color={"red"}>*</Text>
          </Text>
          <Input
            style={{ width: "100%" }}
            onChangeText={(text) => {
              setMedicineForm((prev) => {
                return {
                  ...prev,
                  name: text,
                };
              });
            }}
          ></Input>
        </YStack>
        <YStack gap={5} alignItems="flex-start">
          <Text fontFamily={"$js4"} fontSize={"$4"} color={themeColors.onyx}>
            Dosage<Text color={"red"}>*</Text>
          </Text>
          <Input
            style={{ width: "100%" }}
            onChangeText={(text) => {
              setMedicineForm((prev) => {
                return {
                  ...prev,
                  dosage: text,
                };
              });
            }}
          ></Input>
        </YStack>
        <XStack gap={5} alignItems="center">
          <Text fontFamily={"$js4"} fontSize={"$4"} color={themeColors.onyx}>
            Prescribed Date
          </Text>
          <DTP
            mode="date"
            style={{ width: "100%" }}
            value={startDate}
            onChange={(date) => {
              const newDate = new Date(date.nativeEvent.timestamp);
              setStartDate(newDate);
              setMedicineForm((prev) => {
                return {
                  ...prev,
                  startDate: newDate,
                };
              });
            }}
          />
        </XStack>
        <XStack gap={5} alignItems="center">
          <Text fontFamily={"$js4"} fontSize={"$4"} color={themeColors.onyx}>
            End Date
          </Text>
          <DTP
            style={{ width: "100%" }}
            mode="date"
            value={endDate}
            onChange={(date) => {
              const newDate = new Date(date.nativeEvent.timestamp);
              setEndDate(newDate);
              setMedicineForm((prev) => {
                return {
                  ...prev,
                  endDate: newDate,
                };
              });
            }}
          />
        </XStack>
        <LoaderButton
          style={{ marginTop: 20, marginBottom: 10 }}
          disabled={medicineFormValid(medicineForm) === false}
          text="Add"
          message="Adding..."
          theme={"accent"}
          isLoading={false}
          onPress={() => {
            const form = medicineFormValid(medicineForm);
            if (form && user.phoneNumber) {
              HistoryService.addMedicine({
                ...form,
                phoneNumber: user.phoneNumber,
              }).then(() => {
                onClose();
              });
            }
          }}
        />
      </YStack>
    </ScrollView>
  );
};

export const AddMedicine = ({ user }: { user: UserProfile }) => {
  return (
    <View style={{ flex: 1, backgroundColor: themeColors.plat }}>
      <DrawerSheet<void>
        FC={({ setOpen }) => (
          <FloatingRoundButton onPress={() => setOpen(true)} />
        )}
        Child={({ onClose }) => <MedicineForm onClose={onClose} user={user} />}
        onClose={async (data) => {}}
      ></DrawerSheet>
    </View>
  );
};
