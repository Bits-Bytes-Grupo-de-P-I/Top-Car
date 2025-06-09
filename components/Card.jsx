import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";

// CORES
import Colors from "@/constants/Colors";

const Card = (props) => {
  return (
    <View style={[styles.container, { borderLeftColor: props.cor }]}>
      <TouchableOpacity
        style={styles.conteudo}
        underlayColor="#eee"
        onPress={props.onPress}
      >
        <View>
          {props.children}
          <Text style={styles.texto}>{props.texto}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    height: 96,
    width: Dimensions.get("window").width / 2 - 32,
    borderLeftWidth: 3,
    backgroundColor: Colors.cinzaClaro,
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    boxShadow: "3px 4px 4px rgba(0, 0, 0, 0.25)",
  },
  conteudo: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
  },
  texto: {
    fontFamily: "DM-Sans",
    fontSize: 16,
  },
});
