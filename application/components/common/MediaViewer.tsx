import { useVideoPlayer, VideoView } from "expo-video";
import {
  Button,
  Modal,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Platform,
} from "react-native";
import ImageViewing from "react-native-image-viewing";

export const VideoViewer = ({
  uri,
  onClose,
  show,
}: {
  uri: string;
  onClose: () => void;
  show: boolean;
}) => {
  const vp = useVideoPlayer({
    uri,
  });

  return (
    <Modal
      visible={show}
      onRequestClose={onClose}
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "black",
      }}
    >
      <View style={styles.contentContainer}>
        {vp.status == "loading" ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <View style={styles.controlsContainer}>
              <Button
                title="Close"
                color={Platform.OS === "ios" ? "white" : "transparent"}
                onPress={() => {
                  onClose();
                }}
              ></Button>
            </View>
            <VideoView
              style={styles.video}
              player={vp}
              allowsFullscreen
              allowsPictureInPicture
            />
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
    backgroundColor: "black",
  },
  video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
});

export const ImageViewer = ({
  uris,
  show,
  onClose,
  index = 0
}: {
  uris: { uri: string }[];
  show: boolean;
  onClose: () => void;
  index?: number;
}) => {
  return (
    <ImageViewing
      images={uris}
      imageIndex={index}
      visible={show}
      onRequestClose={() => onClose()}
    />
  );
};
