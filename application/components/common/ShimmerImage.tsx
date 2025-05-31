import { themeColors } from "@/themes/themes";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { FC, useState } from "react";
import { ActivityIndicator, DimensionValue, Image, StyleSheet, View } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { Avatar, Button, YStack, Text } from "tamagui";

export type RoundedAvatarProps = {
  onPress: () => void;
  url?: string;
  altUrl?: string;
  size?: {
    height: DimensionValue;
    width: DimensionValue;
  };
  borderRadius?: number;
};

export const ShimmerImage: FC<RoundedAvatarProps> = ({
  onPress,
  altUrl,
  url,
  size = {
    height: 120,
    width: 120,
  },
  borderRadius = 0,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [key, setKey] = useState(url);

  if (failed) {
    return (
      <View
        style={{
          height: size.height,
          width: size.width,
          borderRadius: borderRadius,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "gray",
        }}
      >
        <YStack gap={5} alignItems="center" justifyContent="center">
          <MaterialIcons
            name="broken-image"
            size={32}
            color={themeColors.light}
          />
          <Button
            icon={<Ionicons name="reload" size={20} />}
            backgroundColor={themeColors.light}
            onPress={() => {
              setKey(`${url}-${Date.now()}`);
            }}
          >
            <Text>Retry</Text>
          </Button>
        </YStack>
      </View>
    );
  }

  return (
    // <ShimmerPlaceholder
    //   visible={loaded}
    //   LinearGradient={LinearGradient}
    //   style={{
    //     width: size.width,
    //     height: size.height,
    //     borderRadius: borderRadius,
    //   }}
    // >
    <View
      style={{ position: "relative", height: size.height, width: size.width }}
    >
      <Image
        style={{
          height: size.height,
          width: size.width,
        }}
        src={url || altUrl}
        onMagicTap={onPress}
        onLoadStart={() => {
          console.log("starting loading", url);
          setLoaded(false);
        }}
        onLoadEnd={() => {
          console.log("ending loading", url);
          setLoaded(true);
        }}
        onError={() => {
          setFailed(true);
        }}
      />
      {!loaded && (
        <ActivityIndicator
          size={"small"}
          color={themeColors.accent}
          style={StyleSheet.absoluteFill}
        />
      )}
    </View>
    // </ShimmerPlaceholder>
  );
};
