import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";

// CORES
import Colors from "@/constants/Colors";

// Dados mockados
const [dadosNota, setDadosNota] = useState({
  cliente: {
    nome: "João Silva",
    tipoPessoa: "física",
    documento: "123.456.789-00",
    telefone: "(11) 98765-4321",
    endereco: "Rua das Flores, 123 - Centro",
    cidade: "São Paulo - SP",
    cep: "12345-678",
  },
  veiculo: {
    marca: "Renault",
    modelo: "Kwid Zen",
    ano: "2022",
    cor: "Branco",
    placa: "ABC1D23",
    km: "15.000 km",
  },
  produtos: [
    {
      id: 1,
      nome: "Óleo Motor 5W30",
      quantidade: 4,
      unidade: "litros",
      valorUnitario: 25.5,
      valorTotal: 102.0,
    },
    {
      id: 2,
      nome: "Filtro de Óleo",
      quantidade: 1,
      unidade: "unidade",
      valorUnitario: 35.0,
      valorTotal: 35.0,
    },
    {
      id: 3,
      nome: "Pastilhas de Freio Dianteira",
      quantidade: 1,
      unidade: "jogo",
      valorUnitario: 120.0,
      valorTotal: 120.0,
    },
  ],
  servicos: [
    {
      id: 1,
      descricao: "Troca de óleo e filtro",
      valorMaoDeObra: 80.0,
      tempo: "1h 30min",
    },
    {
      id: 2,
      descricao: "Substituição de pastilhas de freio",
      valorMaoDeObra: 150.0,
      tempo: "2h 00min",
    },
  ],
});

const BillVehicleContent = () => {
  return (
    <View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Marca/Modelo:</Text>
        <Text style={styles.value}>
          {dadosNota.veiculo.marca} {dadosNota.veiculo.modelo}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Ano:</Text>
        <Text style={styles.value}>{dadosNota.veiculo.ano}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Cor:</Text>
        <Text style={styles.value}>{dadosNota.veiculo.cor}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Placa:</Text>
        <Text style={styles.value}>{dadosNota.veiculo.placa}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Quilometragem:</Text>
        <Text style={styles.value}>{dadosNota.veiculo.km}</Text>
      </View>
    </View>
  );
};

export default BillVehicleContent;

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
    flex: 1,
  },
});
