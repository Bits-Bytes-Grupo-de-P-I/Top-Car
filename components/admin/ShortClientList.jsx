import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

// COMPONENTES
import Badge from "../Badge";

// MOCKS
import clientes from "@/assets/mocks/clientes.json";

// CORES
import Colors from "@/constants/Colors";

const ShortClientList = () => {
  const router = useRouter();
  const [filtro, setFiltro] = useState("");

  const clientesFiltrados = clientes.filter((cliente) => {
    const termo = filtro.toLowerCase();
    return (
      cliente.nome.toLowerCase().includes(termo) ||
      cliente.cpf.toLowerCase().includes(termo) ||
      cliente.status.toLowerCase().includes(termo)
    );
  });

  // Limitar a no máximo 5 clientes para exibição estática
  const mostrarClientes = clientesFiltrados.slice(0, 5);

  // Renderizar cada cliente individualmente
  const renderClients = () => {
    return mostrarClientes.map((cliente) => (
      <TouchableOpacity
        key={cliente.id.toString()}
        style={styles.item}
        onPress={() =>
          router.push({
            pathname: "./admin/clientInfo",
            params: {
              nome: cliente.nome,
              cpf: cliente.cpf,
              status: cliente.status,
            },
          })
        }
      >
        <View style={styles.nomeStatus}>
          <Text style={styles.nome}>{cliente.nome}</Text>
          {cliente.status !== "Finalizado" && (
            <Badge
              text={cliente.status}
              color={
                cliente.status === "Pendente" ? Colors.laranja : Colors.azul
              }
            />
          )}
        </View>
        <Text style={styles.cpf}>CPF: {cliente.cpf}</Text>
      </TouchableOpacity>
    ));
  };

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
        <View style={styles.clientesContainer}>
          {renderClients()}

          {clientesFiltrados.length > 5 && (
            <TouchableOpacity
              style={styles.verMaisBtn}
              onPress={() => router.push("./admin/allClients")}
            >
              <Text style={styles.verMaisTxt}>
                Ver todos os clientes ({clientesFiltrados.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default ShortClientList;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 16,
    backgroundColor: Colors.azulClaro,
    width: "100%",
  },
  clientesContainer: {
    width: "100%",
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
  verMaisBtn: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
  },
  verMaisTxt: {
    color: Colors.grafite,
    fontWeight: "bold",
    fontFamily: "DM-Sans",
  },
});
