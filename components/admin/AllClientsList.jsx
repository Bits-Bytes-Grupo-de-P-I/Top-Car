import { useState, useEffect } from "react";
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

// COMPONENTES
import Badge from "../Badge";

// Cores
import Colors from "@/constants/Colors";

const AllClientsList = () => {
  const router = useRouter();
  const [filtro, setFiltro] = useState("");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Token de autorização (só para exemplo; armazene de forma segura na prática)
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJqb2FvQGV4YW1wbGUuY29tIiwiZnVuY2FvIjoiYWRtaW4iLCJpYXQiOjE3NDg0NTQzODR9.3fxamj4FEzv265boICnC3WqcJZLiJ0Kfsmbpg9S9lFs";

  function formatCPF(cpfString) {
    const apenasDigitos = cpfString.replace(/\D/g, "");
    if (apenasDigitos?.length !== 11) {
      return cpfString;
    }
    return apenasDigitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  // Função para buscar a lista de clientes
  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://topcar-back-end.onrender.com/clientes",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar clientes: ${response.status}`);
      }

      const data = await response.json();
      const transformedData = data.map((cliente) => ({
        ...cliente,
        cpfFormatado: formatCPF(cliente.documento),
      }));

      setClients(transformedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORREÇÃO: Remover 'clients' das dependências para evitar loop infinito
  useEffect(() => {
    fetchClients();
  }, []); // Array vazio - executa apenas uma vez

  // ✅ CORREÇÃO: Usar propriedades corretas dos dados da API
  const clientesFiltrados = clients.filter((client) => {
    const termo = filtro.toLowerCase();
    return (
      client.nome.toLowerCase().includes(termo) ||
      client.documento.toLowerCase().includes(termo) ||
      client.cpfFormatado.toLowerCase().includes(termo) ||
      client.email.toLowerCase().includes(termo)
    );
  });

  // ✅ CORREÇÃO: Usar 'item' ao invés de 'client' (padrão do FlatList)
  const renderClients = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        router.push({
          pathname: "./clientInfo",
          params: {
            nome: item.nome,
            cpf: item.cpfFormatado,
            email: item.email,
            senha: item.senha,
            tipo_pessoa: item.tipo_pessoa,
            cep: item.cep,
            cidade: item.cidade,
            endereco: item.endereco,
            numero: item.numero,
            bairro: item.bairro,
            estado: item.estado,
            telefone: item.telefone,
            funcao: item.funcao,
          },
        })
      }
    >
      <View style={styles.nomeStatus}>
        <Text style={styles.nome}>{item.nome}</Text>
        {/* {item.status !== "Finalizado" && (
          <Badge
            text={item.status}
            color={item.status === "Pendente" ? Colors.laranja : Colors.azul}
          />
        )} */}
      </View>
      <Text style={styles.cpf}>CPF: {item.cpfFormatado}</Text>
      <Text style={styles.email}>Email: {item.email}</Text>
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
      {(() => {
        if (loading) {
          return (
            <Text style={styles.naoEncontrado}>Carregando clientes...</Text>
          );
        } else if (clientesFiltrados?.length === 0) {
          return (
            <Text style={styles.naoEncontrado}>Cliente não encontrado!</Text>
          );
        } else {
          return (
            <FlatList
              data={clientesFiltrados}
              renderItem={renderClients}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.flatListContent}
            />
          );
        }
      })()}
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
