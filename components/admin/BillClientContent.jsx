import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/Colors";

const BillClientContent = ({ data }) => {
  // data é o objeto cliente que veio de props
  const {
    nome,
    documento,
    telefone,
    endereco,
    cidade,
    cep,
  } = data || {};

  return (
    <View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>{nome || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Documento:</Text>
        <Text style={styles.value}>{documento || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Telefone:</Text>
        <Text style={styles.value}>{telefone || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Endereço:</Text>
        <Text style={styles.value}>{endereco || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Cidade:</Text>
        <Text style={styles.value}>{cidade || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>CEP:</Text>
        <Text style={styles.value}>{cep || "-"}</Text>
      </View>
    </View>
  );
};

export default BillClientContent;

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.grafite,
    width: 100,
    marginRight: 12,
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: Colors.grafite,
  },
});
