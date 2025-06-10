import { useState, useEffect } from "react";
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

// CORES
import Colors from "@/constants/Colors";

const ShortClientList = () => {
  const router = useRouter();

  const [clients, setClients] = useState([]);
  const [service, setService] = useState([]);
  const [filtro, setFiltro] = useState("");
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
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchClients();
  }, []);

  // 5) Filtragem baseada no texto digitado em `filtro`:
  const clientesFiltrados = clients.filter((client) => {
    const termo = filtro.toLowerCase();

    const nome = client.nome?.toLowerCase() || "";
    const documento = client.documento?.toLowerCase() || "";
    const status = client.status?.toLowerCase() || "";

    return (
      nome.includes(termo) ||
      documento.includes(termo) ||
      status.includes(termo)
    );
  });

  // Limitar a no máximo 5 clientes para exibição
  const mostrarClientes = clientesFiltrados.slice(0, 5);

  // Função para buscar a lista de serviços (ou agendamentos)
  const fetchService = async () => {
    try {
      const response = await fetch(
        "https://topcar-back-end.onrender.com/agendamentos",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar agendamentos: ${response.status}`);
      }

      const data = await response.json();
      setService(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchService();
  }, []);

  // Calcula de forma segura: só pega service[2] se existir
  const agendamentoDesejado = service?.length > 2 ? service[1] : null; // altere o índice para testar outro

  // Só tenta logar se agendamentoDesejado não for null
  // useEffect(() => {
  //   if (agendamentoDesejado) {
  //     console.log(
  //       "Status do agendamento escolhido:",
  //       agendamentoDesejado.status
  //     );
  //   }
  // }, [agendamentoDesejado]);

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
            <View style={styles.clientesContainer}>
              {mostrarClientes?.map((client) => (
                <TouchableOpacity
                  key={client.id.toString()}
                  style={styles.item}
                  onPress={() =>
                    router.push({
                      pathname: "./admin/clientInfo",
                      params: {
                        nome: client.nome,
                        cpf: client.cpfFormatado,
                        email: client.email,
                        senha: client.senha,
                        tipo_pessoa: client.tipo_pessoa,
                        cep: client.cep,
                        cidade: client.cidade,
                        endereco: client.endereco,
                        numero: client.numero,
                        bairro: client.bairro,
                        estado: client.estado,
                        telefone: client.telefone,
                        funcao: client.funcao,
                      },
                    })
                  }
                >
                  <View style={styles.nomeStatus}>
                    <Text style={styles.nome}>{client.nome}</Text>

                    {agendamentoDesejado &&
                      agendamentoDesejado.status !== "Finalizado" && (
                        <Badge
                          text={agendamentoDesejado.status}
                          color={
                            agendamentoDesejado.status === "Pendente"
                              ? Colors.laranja
                              : Colors.azul
                          }
                        />
                      )}
                  </View>

                  <Text style={styles.cpf}>CPF: {client.cpfFormatado}</Text>
                </TouchableOpacity>
              ))}

              {clientesFiltrados?.length > 5 && (
                <TouchableOpacity
                  style={styles.verMaisBtn}
                  onPress={() => router.push("./admin/allClients")}
                >
                  <Text style={styles.verMaisTxt}>
                    Ver todos os clientes ({clientesFiltrados?.length})
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }
      })()}
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
