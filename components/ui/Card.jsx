import { StyleSheet, Text, View, Dimensions, TouchableHighlight } from "react-native";
import React from "react";

import Colors from "@/constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const Card = (props) => {
  return (
    <View style={[styles.container, { borderLeftColor: props.cor }]}>
      <TouchableHighlight style={styles.conteudo} underlayColor="#eee" onPress={props.onPress}>
        <View>
          <FontAwesome6 name={props.iconName} size={30} color={props.cor} />
          <Text style={styles.texto}>{props.texto}</Text>
        </View>
      </TouchableHighlight>
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
    borderLeftWidth: 3,
    backgroundColor: Colors.cinzaClaro,
    borderRadius: 10,
    padding: 8,
    marginBottom: 16,
  },
  conteudo: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-evenly'
  },
  texto: {
    fontFamily: 'DM-Sans',
    fontSize: 16
  }
});
