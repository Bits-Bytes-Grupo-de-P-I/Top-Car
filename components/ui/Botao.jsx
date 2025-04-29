import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import React from "react";

import Colors from "@/constants/Colors";

const Botao = (props) => {
  return (
    <View>
      <TouchableHighlight
        // Estilos condicionais com base nos props passados nos botões
        underlayColor="transparent"
        style={[
          props.type === "azul"
            ? styles.btnAzul
            : props.type === "verde"
            ? styles.btnVerde
            : styles.btnVermelho,
          styles.btn
        ]}
      >
        <Text style={styles.btnTexto}>{props.type}</Text>
      </TouchableHighlight>
    </View>
  );
};

export default Botao;

const styles = StyleSheet.create({
  btn: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "white",
    width: 120,
    height: 50,
    boxShadow: "3px 4px 4px rgba(0, 0, 0, 0.25)",
  },
  btnTexto: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textTransform: "capitalize",
  },
  btnAzul: {
    backgroundColor: Colors.azulClaro,
  },
  btnVerde: {
    backgroundColor: Colors.verde,
  },
  btnVermelho: {
    backgroundColor: Colors.vermelho,
  },
});
