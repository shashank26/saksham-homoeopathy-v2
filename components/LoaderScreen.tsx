import { View } from "react-native";
import { H2, Spinner } from "tamagui";
import { LogoSvg } from "./Images";

export const LoaderScreen = () => {
  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        gap: "30",
      }}
    >
      <LogoSvg viewBox="0 0 160 160" height={"50%"} width={"100%"} />
      <H2
        style={{
          fontFamily: "JosefinSans-Bold",
          textAlign: "center",
          color: "#ae4137",
        }}
      >
        Saksham Homoeopathy
      </H2>
      <Spinner size="large" color={"#ae4137"} />
    </View>
  );
};
