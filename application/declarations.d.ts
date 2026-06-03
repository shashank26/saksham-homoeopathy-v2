declare module "*.svg" {
    import React from "react";
    import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
  }

declare module "@react-native-firebase/app-check/dist/module/ReactNativeFirebaseAppCheckProvider.js" {
  export { default } from "@react-native-firebase/app-check/dist/typescript/lib/ReactNativeFirebaseAppCheckProvider";
}

