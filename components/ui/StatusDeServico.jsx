import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import React from "react";

const StatusDeServico = () => {
  return (
    <View>
      {/* Container principal */}
      <TouchableHighlight style={styles.containerPrincipal}>
        {/* Container do texto com a bolinha de status */}

        <View style={styles.containerTextoEBolinha}>
          <View style={styles.bolinha}></View>
          <Text style={styles.texto}>Em andamento</Text>
        </View>

        {/* Container do texto com a bolinha de status */}
      </TouchableHighlight>
      {/* Container principal */}
    </View>
  );
};

export default StatusDeServico;

const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 36,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "white",
    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
  },
  containerTextoEBolinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  texto: {
    color: "black",
    fontSize: 16,
  },
  bolinha: {
    height: 17,
    width: 17,
    borderRadius: 50,
    backgroundColor: 'black',
    marginRight: 16
  }
});
