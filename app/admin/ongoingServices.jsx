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
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
// COMPONENTES
import OngoingServiceCard from "@/components/admin/OngoingServiceCard";
import PageHeader from "@/components/PageHeader";

// CORES
import Colors from "@/constants/Colors";

const ongoingServices = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJqb2FvQGV4YW1wbGUuY29tIiwiZnVuY2FvIjoiYWRtaW4iLCJpYXQiOjE3NDg0NTQzODR9.3fxamj4FEzv265boICnC3WqcJZLiJ0Kfsmbpg9S9lFs";

  // Função para buscar serviços do backend
  const fetchServicos = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://topcar-back-end.onrender.com/pedidos",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      // Transformar os dados do backend para o formato esperado pelo componente
      const servicosFormatados = data
        // .filter((item) => item.status !== "concluido") // Filtrar apenas serviços em andamento
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
    // nunca mande 'urgente' como status
    const statusEnviado = "em andamento";

    console.log(">> enviar edição de serviço:", {
      id: servicoId,
      resumo: dadosEditados.servico,
      descricao: dadosEditados.servicoCompleto || dadosEditados.servico,
      status: statusEnviado,
    });

    try {
      const response = await fetch(`https://.../pedidos/${servicoId}`, {
        method: "PUT",
        headers: {
          /* ... */
        },
        body: JSON.stringify({
          resumo: dadosEditados.servico,
          descricao: dadosEditados.servicoCompleto || dadosEditados.servico,
          status: statusEnviado,
        }),
      });

      const bodyText = await response.text();
      let body;
      try {
        body = JSON.parse(bodyText);
      } catch {
        body = bodyText;
      }
      if (!response.ok) {
        console.error("Erro HTTP:", response.status, body);
        return Alert.alert("Erro", body.details || `Status ${response.status}`);
      }

      Alert.alert("Sucesso", "Serviço atualizado com sucesso!");
      return true;
    } catch (err) {
      console.error("Erro ao editar serviço:", err);
      Alert.alert("Erro", err.message || "Não foi possível atualizar");
      return false;
    }
  };

  // Função para deletar pedido
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
              const response = await fetch(
                `https://topcar-back-end.onrender.com/pedidos/${servicoId}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
              }

              // Remover da lista local
              setServicos((prevServicos) =>
                prevServicos.filter((servico) => servico.id !== servicoId)
              );

              Alert.alert("Sucesso", "Serviço excluído com sucesso!");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Erro ao deletar serviço:", error);
      Alert.alert(
        "Erro",
        "Não foi possível excluir o serviço. Tente novamente."
      );
    }
  };

  // Função para atualizar lista (pull to refresh)
  const onRefresh = () => {
    setRefreshing(true);
    fetchServicos();
    setRefreshing(false);
  };

  // Carregar dados na inicialização
  useEffect(() => {
    fetchServicos();
  }, []);

  const handleServicoPress = (item) => {
    console.log("Serviço selecionado:", item);
    // O modal já é aberto automaticamente pelo componente
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
                  onPress={handleServicoPress}
                  onEdit={editarServico}
                  onFinish={deletarServico}
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
  filtrosContainer: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: Colors.cinzaClaro,
  },
  filtroItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: Colors.cinzaClaro,
  },
  filtroItemAtivo: {
    backgroundColor: Colors.azulClaro,
  },
  filtroTexto: {
    fontSize: 14,
    color: Colors.cinzaEscuro,
  },
  filtroTextoAtivo: {
    color: "white",
    fontWeight: "bold",
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
});
