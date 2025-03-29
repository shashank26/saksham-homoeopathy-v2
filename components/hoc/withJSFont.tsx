import React from "react";
import { StyleProp } from "react-native";
import { JSFontNames } from "../controls/utils";

export const withJSFont = <P,>(
  WrappedComponent: React.ComponentType<P>,
  jsFontFamily: JSFontNames
) => {
  return (props: P & { style?: StyleProp<any> }) => {
    return (
      <WrappedComponent
        {...props}
        style={{
          fontFamily: jsFontFamily || "JosefineSans-Regular",
          ...((props.style as object) || {}),
        }}
      />
    );
  };
};
