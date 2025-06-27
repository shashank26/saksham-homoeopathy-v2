import { MomentService } from "@/services/Moment.service";
import { useState } from "react";
import DatePicker from "react-native-date-picker";
import { Button, Text } from "tamagui";

export const DateTimePicker = ({
  value,
  onChange,
  minDate,
  maxDate,
  mode,
}: {
  value: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange: (date: Date) => void;
  mode?: "date" | "time" | "datetime";
}) => {
  const [showCalender, setShowCalender] = useState<boolean>(false);

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
      <DatePicker
        mode={mode}
        modal
        open={showCalender}
        date={value}
        maximumDate={maxDate}
        minimumDate={minDate}
        onConfirm={(date) => {
          const newDate = new Date(date);
          onChange(newDate);
          setShowCalender(false);
        }}
        onCancel={() => {
          setShowCalender(false);
        }}
      />
    </>
  );
};
