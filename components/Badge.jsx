import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Badge = ({ text, color }) => {
  return (
    <View style={[styles.container, { backgroundColor: color }]}>  
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default Badge;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "DM-Sans",
    fontSize: 10,
    textTransform: "uppercase",
  },
});
