import { db } from "@/services/Firebase.service";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, View } from "react-native";
import { Text } from "tamagui";
import { ShimmerImage } from "../common/ShimmerImage";
import { styleSheets } from "../styles";
import { ImageViewer } from "../common/MediaViewer";

export const AwardsScreen = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isMediaVisible, setMediaVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
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
                onPress={() => {
                  setSelectedIndex(images.indexOf(item));
                  setMediaVisible(true);
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
      <ImageViewer
        onClose={() => setMediaVisible(false)}
        show={isMediaVisible}
        uris={images.map((uri) => ({ uri }))}
        index={selectedIndex}
      />
    </View>
  );
};
