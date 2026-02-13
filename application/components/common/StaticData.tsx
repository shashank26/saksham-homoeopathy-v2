import { ActivityIndicator, View } from "react-native";
import { RenderHTML } from "react-native-render-html";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { styleSheets } from "../styles";
import { Button, ScrollView, Text } from "tamagui";
import { db } from "@/services/Firebase.service";
import { useEffect, useState } from "react";

export const StaticData: React.FC<{ docId: string }> = ({ docId }) => {
  const [staticData, setStaticData] = useState<string>("");
  const [extraData, setExtraData] = useState<string>("");

  useEffect(() => {
    if (!docId) return;
    db.collection("static")
      .doc(docId)
      .get()
      .then((doc) => {
        const data = doc.data();
        setStaticData(data?.html);
        setExtraData(data?.extra || "");
      });
  }, [docId]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#eee" }}>
        <View
          style={{
            ...styleSheets.container,
            justifyContent: staticData ? "flex-start" : "center",
            padding: 10,
            overflowY: "scroll",
          }}
        >
          {staticData ? (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
              horizontal={false}
              width={"100%"}
            >
              <RenderHTML source={{ html: staticData }} />
              {extraData ? (
                <Button
                  fontFamily={"$js5"}
                  fontSize={"$2"}
                  style={{
                    backgroundColor: "transparent",
                  }}
                  onPress={() => {
                    setStaticData(staticData + extraData);
                    setExtraData("");
                  }}
                >
                  Read More...
                </Button>
              ) : null}
            </ScrollView>
          ) : (
            <>
              <ActivityIndicator size={"small"} />
              <Text>Loading...</Text>
            </>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
