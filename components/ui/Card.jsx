import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";

import Colors from "@/constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const Card = (props) => {
  return (
    <View style={styles.container}>
      <View>
        <FontAwesome6 name={props.iconName} size={30} color='green' />
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "center",
    height: 90,
    width: Dimensions.get("window").width / 2,
    borderLeftWidth: 2,
    borderLeftColor: Colors.verde,
    backgroundColor: Colors.cinzaClaro,
    borderRadius: 10,
    padding: 8
  },
  conteudo: {},
});
