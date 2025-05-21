import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { useState } from "react";
import Colors from "@/constants/Colors";

const Emergency = () => {
  const [estadoEmergency, setEstadoEmergency] = useState(true);
  return (
    <TouchableHighlight
      style={[
        styles.container,
        { backgroundColor: estadoEmergency ? Colors.laranja : "transparent" }, // Se for uma emergência, vai ativar o fundo vermelho, senão, vai ficar transparente
      ]}
      onPress={() => setEstadoEmergency(!estadoEmergency)}
    >
      <Text
        style={[
          styles.exclamacao,
          { display: estadoEmergency ? "flex" : "none" },
        ]}
      >
        !
      </Text>
    </TouchableHighlight>
  );
};

export default Emergency;

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.aluminio,
    color: Colors.grafite,
    margin: 16,
  },
  exclamacao: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "DM-Sans",
  },
});
