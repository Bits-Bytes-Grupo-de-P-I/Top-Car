import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import { useState } from "react";

import Colors from "@/constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const StandardServices = (props) => {
  const [selecionado, setSelecionado] = useState(false);
  return (
    // Container principal
    <View style={styles.container}>
      {/* Container do icone e texto */}
      <View style={styles.checkTexto}>
        <TouchableHighlight
          style={[
            styles.check,
            { backgroundColor: selecionado ? Colors.verde : "transparent" }, // Se for uma emergência, vai ativar o fundo vermelho, senão, vai ficar transparente
          ]}
          onPress={() => setSelecionado(!selecionado)}
        >
          <View
            style={[
              styles.exclamacao,
              { display: selecionado ? "flex" : "none" },
            ]}
          >
            <FontAwesome6 name="check" size={20} color="white" />
          </View>
        </TouchableHighlight>
        <Text style={{ fontFamily: "DM-Sans" }}>{props.texto}</Text>
      </View>
      {/* Container do icone e texto */}

      <Text style={{ fontFamily: "DM-Sans" }}>{props.preco}</Text>
    </View>
    // Container principal
  );
};

export default StandardServices;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    flex: 1,
    width: "100%",
    borderRadius: 10,
    padding: 8,
  },
  check: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "black",
    color: "white",
    marginRight: 8,
  },
  checkTexto: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
