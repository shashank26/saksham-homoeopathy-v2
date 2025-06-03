import { useAuth } from "@/components/auth/hooks/useAuth";
import { renderRightActions } from "@/components/common/DeleteRightAction";
import { styleSheets } from "@/components/styles";
import { Role } from "@/services/Firebase.service";
import { HistoryService, MedicineType } from "@/services/History.service";
import { MomentService } from "@/services/Moment.service";
import { themeColors } from "@/themes/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Text, XStack, YStack } from "tamagui";

const AdminMedicineCard = ({ item }: { item: MedicineType }) => {
  const ref = useRef<any>(null);
  return (
    <Swipeable
      ref={ref}
      renderRightActions={() =>
        renderRightActions(() => {
          HistoryService.deleteMedicine(item.id as string);
        })
      }
    >
      <MedicineCard item={item} />
    </Swipeable>
  );
};

const MedicineCard = ({ item }: { item: MedicineType }) => {
  return (
    <XStack
      style={{
        padding: 10,
        margin: 5,
        borderRadius: 5,
        backgroundColor: themeColors.accent,
        justifyContent: "space-between",
        ...styleSheets.shadowStyle,
      }}
    >
      <YStack gap={5} justifyContent="space-between">
        <Text fontFamily={"$js5"} color={themeColors.plat} fontSize={24}>
          {item.name}
        </Text>
        <Text fontFamily={"$js4"} color={themeColors.plat} fontSize={16}>
          {item.dosage}
        </Text>
      </YStack>
      <YStack gap={5} justifyContent="space-between">
        <Text fontFamily={"$js4"} color={themeColors.plat} fontSize={16}>
          {MomentService.getDDMMMYYY(item.startDate)}
        </Text>
        <Text fontFamily={"$js4"} color={themeColors.plat} fontSize={16}>
          {MomentService.getDDMMMYYY(item.endDate)}
        </Text>
      </YStack>
    </XStack>
  );
};

export const UserHistoryScreen = ({ phoneNumber }: { phoneNumber: string }) => {
  const { role } = useAuth();
  const [medicines, setMedicines] = useState<MedicineType[]>([]);
  useEffect(() => {
    const unsub = HistoryService.onMedicineUpdateForUser(
      phoneNumber,
      (medecines) => {
        setMedicines(medecines);
      }
    );
    return unsub;
  }, []);
  return medicines.length ? (
    <View>
      <FlatList
        data={medicines}
        renderItem={({ item }) =>
          role === Role.ADMIN || role === Role.DOCTOR ? (
            <AdminMedicineCard item={item} />
          ) : (
            <MedicineCard item={item} />
          )
        }
        keyExtractor={(item) => item.id as string}
      />
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: themeColors.plat,
      }}
    >
      <MaterialIcons
        name="disabled-visible"
        size={46}
        color={themeColors.accent}
      />
      <Text style={{ marginLeft: 10 }} fontFamily={"$js6"} fontSize={24}>
        No Medicines added.
      </Text>
    </View>
  );
};
