import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { useState } from "react";
import Colors from "@/constants/Colors";

const Emergencia = () => {
  const [estadoEmergencia, setEstadoEmergencia] = useState(false);
  return (
    <TouchableHighlight
      style={[
        styles.container,
        { backgroundColor: estadoEmergencia ? Colors.vermelho : 'transparent' },
      ]}
      onPress={() => setEstadoEmergencia(!estadoEmergencia)}
    >
      <Text style={[styles.exclamacao, { display: estadoEmergencia ? 'flex' : 'none' }]}>!</Text>
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
  },
  exclamacao: {
    color: "white",
    fontWeight: "bold",
  },
});
