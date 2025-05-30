import { StyleSheet, Text, TouchableOpacity } from "react-native";

// Cores
import Colors from "@/constants/Colors";

const SeeMoreBtn = (props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Text style={styles.texto}>Ver mais +</Text>
    </TouchableOpacity>
  );
};

export default SeeMoreBtn;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.azulClaro,
    borderRadius: 20,
  },
  texto: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "DM-Sans",
  },
});
