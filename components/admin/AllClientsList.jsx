import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

// Dados mockados
import clientes from "@/assets/mocks/clientes.json";

// Cores
import Colors from "@/constants/Colors";

const AllClientsList = () => {
  const router = useRouter();
  const [filtro, setFiltro] = useState("");

  const getStatusStyle = (status) => {
    switch (status) {
      case "Em andamento":
        return { color: Colors.verde };
      case "Pendente":
        return { color: Colors.laranja };
      default:
        return { color: Colors.aluminio };
    }
  };

  const renderStatus = (status) => {
    if (status === "Finalizado") {
      return <Text style={[styles.status, getStatusStyle(status)]}></Text>;
    }
    return (
      <Text style={[styles.status, getStatusStyle(status)]}>{status}</Text>
    );
  };

  const clientesFiltrados = clientes.filter((cliente) => {
    const termo = filtro.toLowerCase();
    return (
      cliente.nome.toLowerCase().includes(termo) ||
      cliente.cpf.toLowerCase().includes(termo) ||
      cliente.status.toLowerCase().includes(termo)
    );
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        router.push({
          pathname: "./clientInfo",
          params: {
            nome: item.nome,
            cpf: item.cpf,
            status: item.status,
          },
        })
      }
    >
      <View style={styles.nomeStatus}>
        <Text style={styles.nome}>{item.nome}</Text>
        {renderStatus(item.status)}
      </View>
      <Text style={styles.cpf}>CPF: {item.cpf}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar cliente..."
        value={filtro}
        onChangeText={setFiltro}
      />

      {clientesFiltrados.length === 0 ? (
        <Text style={styles.naoEncontrado}>Cliente não encontrado!</Text>
      ) : (
        <FlatList
          data={clientesFiltrados}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </SafeAreaView>
  );
};

export default AllClientsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    padding: 16,
    backgroundColor: Colors.azulClaro,
    width: "100%",
  },
  flatListContent: {
    paddingBottom: 8,
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
  nomeStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.grafite,
    fontFamily: "DM-Sans",
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "DM-Sans",
  },
  cpf: {
    fontSize: 14,
    color: Colors.grafite,
    fontFamily: "DM-Sans",
  },
  naoEncontrado: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 20,
    fontFamily: "DM-Sans",
    color: "white",
    fontWeight: "bold",
  },
});
