const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

module.exports = (() => {
  const projectRoot = __dirname;
  const config = getDefaultConfig(projectRoot);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo")
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
    extraNodeModules: {
      ...resolver.extraNodeModules,
      "@tamagui/portal": path.resolve(projectRoot, "node_modules/@tamagui/portal"),
    },
  };

  return withNativeWind(config, { input: './global.css' });
})();