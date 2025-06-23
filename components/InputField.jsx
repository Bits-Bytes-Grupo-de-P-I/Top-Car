import { StyleSheet, Text, View, TextInput } from "react-native";
import { MaskedTextInput } from "react-native-mask-text";

const InputField = (props) => {
  const InputComponent = props.mascara ? MaskedTextInput : TextInput;
  return (
    <View style={[styles.container, { width: props.largura || "100%" }]}>
      <Text style={styles.label}>{props.tipoDeInfo}</Text>
      <InputComponent
        style={styles.input}
        keyboardType={props.keyboardType || 'default'}
        maxLength={props.maxLength}
        mask={props.mascara} // Só usado se for MaskedTextInput
        onChangeText={props.onChangeText || (() => {})}
        value={props.valor}
        autoCapitalize={props.autoCapitalize}
        placeholder={props.placeholder}
        placeholderTextColor="#999"
      />
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
    fontFamily: "DM-Sans"
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: "100%",
    color: "#333",
    fontFamily: "DM-Sans"
  },
});
