import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import Colors from "@/constants/Colors";

const Badge = (props) => {
  const [estadoBadge, setEstadoBadge] = useState(true);
  return (
    <View style={[styles.container, {backgroundColor: props.color}]}>
      <Text style={styles.text}>{props.text}</Text>
    </View>
  );
};

export default Badge;

const styles = StyleSheet.create({
  container: {
    padding: 5,
    borderRadius: 10,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "DM-Sans",
    fontSize: 10,
    textTransform: 'uppercase'
  },
});
