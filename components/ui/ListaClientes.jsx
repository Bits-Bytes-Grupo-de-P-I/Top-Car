import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  SafeAreaView,
} from "react-native";

import Colors from "@/constants/Colors";
import clientes from "@/assets/mocks/clientes.json";

const getStatusStyle = (status) => {
  switch (status) {
    case "Em andamento":
      return { color: Colors.verde };
    case "Pendente":
      return { color: Colors.vermelho };
    default:
      return { color: Colors.aluminio };
  }
};

const renderStatus = (status) => {
  if (status === "Finalizado") {
    return <Text style={[styles.status, getStatusStyle(status)]}></Text>;
  }
  return <Text style={[styles.status, getStatusStyle(status)]}>{status}</Text>;
};

const ListaClientes = () => {
  const [filtro, setFiltro] = useState("");

  const clientesFiltrados = clientes.filter((cliente) => {
    const termo = filtro.toLowerCase();
    return (
      cliente.nome.toLowerCase().includes(termo) ||
      cliente.cpf.toLowerCase().includes(termo) ||
      cliente.status.toLowerCase().includes(termo)
    );
  });

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.nomeEstatus}>
        <Text style={styles.nome}>{item.nome}</Text>
        {renderStatus(item.status)}
      </View>
      <Text style={styles.cpf}>CPF: {item.cpf}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TextInput
          style={styles.input}
          placeholder="Buscar cliente..."
          value={filtro}
          onChangeText={setFiltro}
        />
      </View>

      <FlatList
        data={clientesFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default ListaClientes;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    flex: 1,
    padding: 16,
    backgroundColor: Colors.cinzaClaro,
    margin: 20,
    minHeight: 300
  },
  input: {
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    fontSize: 16,
  },
  item: {
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  nomeEstatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.grafite,
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
  },
  cpf: {
    fontSize: 14,
    color: Colors.grafite,
  },
});
