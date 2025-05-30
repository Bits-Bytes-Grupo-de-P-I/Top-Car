import { StyleSheet, Text, TouchableOpacity } from "react-native";

// Cores
import Colors from "@/constants/Colors";

const Button = (props) => {
  return (
    <>
      <TouchableOpacity
        onPress={props.onPress}
        // Estilos condicionais com base nos props passados nos botões
        underlayColor="transparent"
        style={[styles.btn, { backgroundColor: props.cor }]}
      >
        {props.children}
        <Text style={styles.btnTexto}>{props.texto}</Text>
      </TouchableOpacity>
    </>
  );
};

export default Button;

const styles = StyleSheet.create({
  btn: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    flex: 2,
    width: 100,
    height: 40,
    marginHorizontal: 10,
  },
  btnTexto: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "capitalize",
    fontFamily: "DM-Sans",
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
