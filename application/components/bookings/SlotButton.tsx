import { SlotTime } from "@/services/Booking.service";
import { themeColors } from "@/themes/themes";
import { Button } from "tamagui";

export const SlotButton = ({
  slot,
  isSelected,
  onPress,
}: {
  slot: { label: string; value: SlotTime };
  isSelected: boolean;
  onPress: () => void;
}) => (
  <Button
    fontFamily={"$js4"}
    fontSize={"$4"}
    backgroundColor={isSelected ? themeColors.accent : undefined}
    textProps={{
      color: isSelected ? themeColors.plat : themeColors.onyx,
      fontWeight: "bold",
    }}
    onPress={onPress}
  >
    {slot.label}
  </Button>
);
