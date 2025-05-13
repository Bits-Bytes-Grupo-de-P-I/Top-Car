import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaskedTextInput } from "react-native-mask-text";

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
      />
    </View>
  );
};

export default CampoDeInput;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  tituloCampo: {
    fontSize: 20,
    marginBottom: 4,
    color: "white",
    fontFamily: "DM-Sans",
  },
  campo: {
    borderRadius: 5,
    backgroundColor: "white",
    fontSize: 16,
    color: "black",
    paddingLeft: 8,
    width: "100%", // esse width é do campo de texto, que vai se ajustar ao container
    paddingVertical: 6,
    height: 32,
  },
});
