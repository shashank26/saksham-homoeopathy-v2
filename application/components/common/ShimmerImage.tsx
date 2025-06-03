import { themeColors } from "@/themes/themes";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { FC, useState } from "react";
import {
  ActivityIndicator,
  DimensionValue,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text, YStack } from "tamagui";
import { Image } from "expo-image";
import { styleSheets } from "../styles";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export type RoundedAvatarProps = {
  onPress?: () => void;
  url: string;
  altUrl?: string;
  size?: {
    height: DimensionValue;
    width: DimensionValue;
  };
  resizeMode?: "contain";
  borderRadius?: number;
};

export const ShimmerImage: FC<RoundedAvatarProps> = React.memo(
  ({
    onPress,
    altUrl,
    url,
    size = {
      height: 120,
      width: 120,
    },
    resizeMode,
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

    const view = (
      <Image
        style={{
          height: size.height,
          width: size.width,
          borderRadius: borderRadius,
        }}
        placeholder={{ blurhash }}
        contentFit={resizeMode}
        source={url || altUrl}
        cachePolicy={"memory-disk"}
        onLoadStart={() => {
          // console.log("starting loading", url);
          setLoaded(false);
        }}
        onLoadEnd={() => {
          // console.log("ending loading", url);
          setLoaded(true);
        }}
        onError={() => {
          setFailed(true);
        }}
      />
    );

    return (
      <View
        style={{
          position: "relative",
          height: size.height,
          width: size.width,
          borderWidth: 1,
          borderRadius,
          borderColor: "#eee",
        }}
      >
        {onPress ? (
          <TouchableOpacity onPress={onPress}>{view}</TouchableOpacity>
        ) : (
          view
        )}
        {!loaded && (
          <ActivityIndicator
            size={"small"}
            color={themeColors.accent}
            style={StyleSheet.absoluteFill}
          />
        )}
      </View>
    );
  },
  (prev, next) => {
    return (
      prev.url === next.url &&
      prev.altUrl === next.altUrl &&
      prev.resizeMode === next.resizeMode &&
      prev.borderRadius === next.borderRadius &&
      prev.size?.width === next.size?.width &&
      prev.size?.height === next.size?.height
    );
  }
);
