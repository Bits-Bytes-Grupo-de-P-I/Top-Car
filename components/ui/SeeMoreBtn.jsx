import { StyleSheet, Text, View } from "react-native";
import React from "react";

import Colors from "@/constants/Colors";
import { TouchableOpacity } from "react-native";

const SeeMoreBtn = (props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Text style={styles.texto}>Ver mais +</Text>
    </TouchableOpacity>
  );
};

export default SeeMoreBtn;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.azulClaro,
    borderRadius: 20,
  },
  texto: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "DM-Sans",
  },
});
