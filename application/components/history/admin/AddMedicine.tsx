import { DrawerSheet } from "@/components/common/DrawerSheet";
import { FloatingRoundButton } from "@/components/common/FloatingRoundButton";
import { LoaderButton } from "@/components/controls/LoaderButton";
import { UserProfile } from "@/services/Auth.service";
import { HistoryService, MedicineType } from "@/services/History.service";
import { MomentService } from "@/services/Moment.service";
import { themeColors } from "@/themes/themes";
import DTP from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform } from "react-native";
import { Button, Input, ScrollView, Text, View, XStack, YStack } from "tamagui";

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

const DateTimePicker = ({
  value,
  onChange,
  minDate,
}: {
  value: Date;
  minDate?: Date;
  onChange: (date: Date) => void;
}) => {
  const os = Platform.OS;
  const [showCalender, setShowCalender] = useState<boolean>(false);
  const calender = (
    <DTP
      mode="date"
      display="calendar"
      style={{ width: "100%" }}
      value={value}
      minimumDate={minDate}
      onChange={(date) => {
        const newDate = new Date(date.nativeEvent.timestamp);
        onChange(newDate);
        setShowCalender(false);
      }}
    />
  );

  if (os === "ios") {
    return calender;
  } else {
    return (
      <>
        <Button
          onPress={() => {
            setShowCalender(true);
          }}
        >
          <Text fontFamily={"$js5"} fontSize={"$4"}>
            {MomentService.getDDMMMYYY(value)}
          </Text>
        </Button>
        {showCalender && calender}
      </>
    );
  }
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
            Name
            <Text fontFamily={"$js4"} fontSize={"$4"} color={"red"}>
              *
            </Text>
          </Text>
          <Input
            fontFamily={"$js4"}
            fontSize={"$4"}
            maxLength={50}
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
          <Text
            alignSelf="flex-end"
            fontFamily={"$js4"}
            fontSize={"$1"}
            color={themeColors.accent}
          >
            {medicineForm.name?.length || 0}/50
          </Text>
        </YStack>
        <YStack gap={5} alignItems="flex-start">
          <Text fontFamily={"$js4"} fontSize={"$4"} color={themeColors.onyx}>
            Dosage
            <Text fontFamily={"$js4"} fontSize={"$4"} color={"red"}>
              *
            </Text>
          </Text>
          <Input
            fontFamily={"$js4"}
            fontSize={"$4"}
            maxLength={50}
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
          <Text
            alignSelf="flex-end"
            fontFamily={"$js4"}
            fontSize={"$1"}
            color={themeColors.accent}
          >
            {medicineForm.dosage?.length || 0}/50
          </Text>
        </YStack>
        <XStack gap={5} alignItems="center">
          <Text fontFamily={"$js4"} fontSize={"$4"} color={themeColors.onyx}>
            Prescribed Date
          </Text>
          <DateTimePicker
            value={startDate}
            onChange={(date) => {
              setStartDate(date);
              setMedicineForm((prev) => {
                return {
                  ...prev,
                  startDate: date,
                };
              });
            }}
          />
        </XStack>
        <XStack gap={5} alignItems="center">
          <Text fontFamily={"$js4"} fontSize={"$4"} color={themeColors.onyx}>
            End Date
          </Text>
          <DateTimePicker
            value={endDate}
            minDate={startDate}
            onChange={(date) => {
              setEndDate(date);
              setMedicineForm((prev) => {
                return {
                  ...prev,
                  endDate: date,
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
