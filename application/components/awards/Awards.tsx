import { db } from "@/services/Firebase.service";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, View } from "react-native";
import { styleSheets } from "../styles";
import { ScrollView, Text, YStack } from "tamagui";
import { ShimmerImage } from "../common/ShimmerImage";
import { FlatList } from "react-native-gesture-handler";

export const AwardsScreen = () => {
  const [images, setImages] = useState<string[]>([]);
  useEffect(() => {
    db.collection("static")
      .doc("awards")
      .get()
      .then((data) => {
        setImages(data.data()?.images);
      });
  }, []);

  return (
    <View style={styleSheets.container}>
      {images?.length ? (
        <FlatList
          data={images}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={{ margin: 10 }}>
              <ShimmerImage
                url={item}
                size={{
                  height: Dimensions.get("window").width - 30,
                  width: Dimensions.get("window").width - 30,
                }}
                borderRadius={10}
              />
            </View>
          )}
        />
      ) : (
        <>
          <ActivityIndicator />
          <Text>Loading...</Text>
        </>
      )}
    </View>
  );
};
