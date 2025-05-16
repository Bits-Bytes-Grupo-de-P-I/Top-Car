import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaskedTextInput } from "react-native-mask-text";

import Colors from '@/constants/Colors'

const CampoDeInput = (props) => {
  return (
    <View style={[styles.container, { width: props.largura || "100%" }]}>
      <Text style={styles.tituloCampo}>{props.tipoDeInfo}</Text>
      <MaskedTextInput
        style={styles.campo}
        keyboardType={props.keyboardType}
        mask={props.mascara}
        onChangeText={props.onChangeText || (() => {})}
        value={props.valor}
        autoCapitalize={props.autoCapitalize}
        placeholder={props.placeholder}
        placeholderTextColor={Colors.cinzaClaro}
      />
    </View>
  );
};

export default CampoDeInput;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  tituloCampo: {
    fontSize: 20,
    marginBottom: 4,
    color: "white",
    fontFamily: "DM-Sans",
  },
  campo: {
    borderRadius: 8,
    // backgroundColor: "white",
    borderWidth: 2,
    borderColor: Colors.aluminio,
    fontSize: 16,
    color: Colors.cinzaClaro,
    padding: 8,
    width: "100%", // esse width é do campo de texto, que vai se ajustar ao container
  },
});
