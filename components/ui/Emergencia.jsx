import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { useState } from "react";
import Colors from "@/constants/Colors";

const Emergencia = () => {
  const [estadoEmergencia, setEstadoEmergencia] = useState(false);
  return (
    <TouchableHighlight
      style={[
        styles.container,
        { backgroundColor: estadoEmergencia ? Colors.vermelho : "transparent" }, // Se for uma emergência, vai ativar o fundo vermelho, senão, vai ficar transparente
      ]}
      onPress={() => setEstadoEmergencia(!estadoEmergencia)}
    >
      <Text
        style={[
          styles.exclamacao,
          { display: estadoEmergencia ? "flex" : "none" },
        ]}
      >
        !
      </Text>
    </TouchableHighlight>
  );
};

export default Emergencia;

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
    color: "white",
    margin: 16
  },
  exclamacao: {
    color: "white",
    fontWeight: "bold",
    fontFamily: 'DM-Sans'
  },
});
