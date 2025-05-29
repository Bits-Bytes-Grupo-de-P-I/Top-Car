import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";

import Colors from "@/constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const Card = (props) => {
  return (
    <View style={[styles.container, { borderLeftColor: props.cor }]}>
      <TouchableOpacity
        style={styles.conteudo}
        underlayColor="#eee"
        onPress={props.onPress}
      >
        <View>
          <FontAwesome6
            style={{ marginBottom: 4 }}
            name={props.iconName}
            size={30}
            color={props.cor}
          />
          <Text style={styles.texto}>{props.texto}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    height: 96,
    width: Dimensions.get("window").width / 2 - 32,
    borderLeftWidth: 3,
    backgroundColor: Colors.cinzaClaro,
    borderRadius: 10,
    padding: 8,
    marginBottom: 16,
    boxShadow: "3px 4px 4px rgba(0, 0, 0, 0.25)",
  },
  conteudo: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
  },
  texto: {
    fontFamily: "DM-Sans",
    fontSize: 16,
  },
});
