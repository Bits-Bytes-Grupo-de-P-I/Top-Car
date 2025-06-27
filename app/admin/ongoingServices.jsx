// Tela para visualização dos serviços em andamento
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { sendImmediateNotification } from "@/utils/notifications";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
// COMPONENTES
import OngoingServiceCard from "@/components/admin/OngoingServiceCard";
import PageHeader from "@/components/PageHeader";

// CORES
import Colors from "@/constants/Colors";

// Constantes da API
const API_BASE_URL = "https://topcar-back-end.onrender.com";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJqb2FvQGV4YW1wbGUuY29tIiwiZnVuY2FvIjoiYWRtaW4iLCJpYXQiOjE3NDg0NTQzODR9.3fxamj4FEzv265boICnC3WqcJZLiJ0Kfsmbpg9S9lFs";

const ongoingServices = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Função genérica para fazer requisições HTTP
  const makeRequest = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  };

  // Função para buscar serviços do backend
  const fetchServicos = async () => {
    try {
      setLoading(true);
      const data = await makeRequest(`${API_BASE_URL}/pedidos`);

      // Transformar os dados do backend para o formato esperado pelo componente
      const servicosFormatados = data
        .filter((item) => item.status !== "concluido") // Filtrar apenas serviços em andamento
        .map((item) => ({
          id: item.id,
          clienteNome: item.nome,
          clienteTelefone: item.telefone,
          veiculo: `${item.modelo} (${item.ano})`,
          placa: item.placa,
          servico: item.resumo || item.descricao,
          servicoCompleto: item.descricao,
          dataAgendada: formatDateFromAPI(item.dataPedido),
          status: item.status,
          urgente:
            item.status === "urgente" ||
            item.resumo?.toLowerCase().includes("urgente"),
        }));

      setServicos(servicosFormatados);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar os serviços. Tente novamente.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Função para formatar data da API
  const formatDateFromAPI = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    } catch (error) {
      return dateString;
    }
  };

  // Função para editar serviço
  const editarServico = async (servicoId, dadosEditados) => {
    try {
      // Primeiro, buscar os dados atuais do pedido para obter cliente_id e veiculo_id
      const currentPedido = await makeRequest(`${API_BASE_URL}/pedidos/${servicoId}`);

      const updateData = {
        cliente_id: currentPedido.cliente_id,
        veiculo_id: currentPedido.veiculo_id,
        resumo: dadosEditados.servico,
        descricao: dadosEditados.servicoCompleto || dadosEditados.servico,
        status: dadosEditados.status || "em andamento",
        dataPedido: dadosEditados.dataAgendada,
      };

      await makeRequest(`${API_BASE_URL}/pedidos/${servicoId}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });

      Alert.alert("Sucesso", "Serviço atualizado com sucesso!");
      await fetchServicos(); // Recarregar a lista
      return true;
    } catch (error) {
      console.error("Erro ao editar serviço:", error);
      Alert.alert("Erro", "Não foi possível atualizar o serviço.");
      return false;
    }
  };

  // Função para finalizar serviço (alterar status para concluído)
  const finalizarServico = async (servicoId) => {
    try {
      Alert.alert(
        "Confirmar Finalização",
        "Tem certeza que deseja finalizar este serviço?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Finalizar",
            style: "default",
            onPress: async () => {
              try {
                await makeRequest(`${API_BASE_URL}/pedidos/${servicoId}`, {
                  method: "PUT",
                  body: JSON.stringify({ status: "concluido" }),
                });

                // Remover da lista local (já que filtramos por status !== "concluido")
                setServicos((prevServicos) =>
                  prevServicos.filter((servico) => servico.id !== servicoId)
                );

                Alert.alert("Sucesso", "Serviço finalizado com sucesso!");
              } catch (error) {
                console.error("Erro ao finalizar serviço:", error);
                Alert.alert("Erro", "Não foi possível finalizar o serviço.");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Erro inesperado:", error);
      Alert.alert("Erro", "Ocorreu um erro inesperado.");
    }
  };

  // Função para deletar pedido (remover completamente)
  const deletarServico = async (servicoId) => {
    try {
      Alert.alert(
        "Confirmar Exclusão",
        "Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: async () => {
              try {
                await makeRequest(`${API_BASE_URL}/pedidos/${servicoId}`, {
                  method: "DELETE",
                });

                // Remover da lista local
                setServicos((prevServicos) =>
                  prevServicos.filter((servico) => servico.id !== servicoId)
                );

                Alert.alert("Sucesso", "Serviço excluído com sucesso!");
              } catch (error) {
                console.error("Erro ao deletar serviço:", error);
                Alert.alert("Erro", "Não foi possível excluir o serviço.");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Erro inesperado:", error);
      Alert.alert("Erro", "Ocorreu um erro inesperado.");
    }
  };

  // Função para atualizar lista (pull to refresh)
  const onRefresh = () => {
    setRefreshing(true);
    fetchServicos();
  };

  // Carregar dados na inicialização
  useEffect(() => {
    fetchServicos();
  }, []);

  // Callback para quando um serviço é atualizado
  const handleServicoUpdate = (servicoId, dadosAtualizados) => {
    setServicos((prevServicos) =>
      prevServicos.map((servico) =>
        servico.id === servicoId ? { ...servico, ...dadosAtualizados } : servico
      )
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground
          source={require("@/assets/images/fundo.jpg")}
          style={styles.background}
          resizeMode="cover"
        >
          <PageHeader
            title="Serviços em Andamento"
            containerStyle={{ backgroundColor: Colors.azulClaro }}
            titleStyle={{ color: "#fff" }}
          />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.azulClaro} />
            <Text style={styles.loadingText}>Carregando serviços...</Text>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, marginBottom: 20 }}>
      <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <PageHeader
          title="Serviços em Andamento"
          containerStyle={{ backgroundColor: Colors.azulClaro }}
          titleStyle={{ color: "#fff" }}
        />
        <ScrollView
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.azulClaro]}
            />
          }
        >
          <View style={styles.listaContainer}>
            {servicos?.length > 0 ? (
              servicos.map((item) => (
                <OngoingServiceCard
                  key={item.id}
                  item={item}
                  onEdit={editarServico}
                  onFinish={finalizarServico}
                  onDelete={deletarServico}
                  onUpdate={handleServicoUpdate}
                  fetchServicos={fetchServicos}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <FontAwesome6
                  name="clipboard-list"
                  size={48}
                  color={Colors.cinzaEscuro}
                />
                <Text style={styles.emptyText}>
                  Nenhum serviço em andamento
                </Text>
                <Text style={styles.emptySubText}>
                  Puxe para baixo para atualizar
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ongoingServices;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.cinzaEscuro,
    textAlign: "center",
  },
  listaContainer: {
    padding: 16,
    paddingBottom: 80, // Espaço para o botão flutuante
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.cinzaEscuro,
    textAlign: "center",
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.cinzaClaro,
    textAlign: "center",
  },
});