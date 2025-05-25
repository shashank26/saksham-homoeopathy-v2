import { PropsWithChildren } from "react";

export type JSFontNames =
  | "JosefinSans-Bold"
  | "JosefinSans-Regular"
  | "JosefinSans-SemiBold"
  | "JosefinSans-Light"
  | "JosefinSans-Thin"
  | "JosefinSans-ExtraLight"
  | "JosefinSans-Medium"
  | "JosefinSans-BoldItalic"
  | "JosefinSans-ExtraLightItalic"
  | "JosefinSans-Italic"
  | "JosefinSans-LightItalic"
  | "JosefinSans-MediumItalic"
  | "JosefinSans-SemiBoldItalic"
  | "JosefinSans-ThinItalic";

export type JSProps<T> = {
  JSFontFamily?: JSFontNames;
} & T;
