import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import React from "react";

import Colors from "@/constants/Colors";

const Botao = (props) => {
  return (
    <>
      <TouchableHighlight onPress={props.onPress}
        // Estilos condicionais com base nos props passados nos botões
        underlayColor="transparent"
        style={[
          props.cor === "azul"
            ? styles.btnAzul
            : props.cor === "verde"
            ? styles.btnVerde
            : styles.btnVermelho,
          styles.btn
        ]}
      >
        <Text style={styles.btnTexto}>{props.texto}</Text>
      </TouchableHighlight>
    </>
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
    width: 100,
    height: 40,
    boxShadow: "3px 4px 4px rgba(0, 0, 0, 0.25)",
  },
  btnTexto: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textTransform: "capitalize",
    fontFamily: 'DM-Sans'
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
