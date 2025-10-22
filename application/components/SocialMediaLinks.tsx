import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Linking,
  Image,
  StyleSheet,
} from "react-native";

const socialLinks = {
  instagram: "https://instagram.com/saksham_homoeopathy",
  twitter: "https://twitter.com/drshubhangi19",
  facebook: "https://www.facebook.com/shubhangee.kaushal",
  youtube: "https://www.youtube.com/@drshubhangi19",
};

export default function SocialMediaLinks() {
  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.warn("Can't open URL:", url);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {Object.entries(socialLinks).map(([key, url]) => (
        <TouchableOpacity
          key={key}
          onPress={() => openLink(url)}
          style={styles.button}
        >
          <Image source={{ uri: getIcon(key) }} style={styles.icon} />
          <Text style={styles.text}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </>
  );
}

const getIcon = (key: string) => {
  const icons: Record<string, string> = {
    instagram: "https://cdn-icons-png.flaticon.com/512/1384/1384063.png",
    twitter: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
    facebook: "https://cdn-icons-png.flaticon.com/512/5968/5968764.png",
    youtube: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
  };
  return icons[key];
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
  },
  text: {
    marginTop: 5,
    fontSize: 12,
  },
});
