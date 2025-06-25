import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// COMPONENTES
import PageHeader from "@/components/PageHeader";
import ClientServiceCard from "@/components/client/ClientServiceCard";

// ÍCONES
import { FontAwesome6 } from "@expo/vector-icons";

// CORES
import Colors from "@/constants/Colors";

const serviceStatus = () => {
  const [meuServicos, setMeuServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configurações da API
  const API_BASE_URL = "https://topcar-back-end.onrender.com";
  const AUTH_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJqb2FvQGV4YW1wbGUuY29tIiwiZnVuY2FvIjoiYWRtaW4iLCJpYXQiOjE3NDg0NTQzODR9.3fxamj4FEzv265boICnC3WqcJZLiJ0Kfsmbpg9S9lFs";

  // Função para buscar pedidos da API
  const fetchPedidos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/pedidos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      // Transformar os dados da API para o formato esperado pelo componente
      const servicosFormatados = data.map((pedido) => ({
        id: pedido.id,
        clienteNome: pedido.nome,
        telefone: pedido.telefone,
        veiculo: `${pedido.modelo} ${pedido.ano}`,
        placa: pedido.placa,
        servico: pedido.resumo,
        observacoes: pedido.descricao,
        dataAgendada: formatarData(pedido.dataPedido),
        status: mapearStatus(pedido.status),
        urgente: pedido.status === "urgente" || false, // Ajustar conforme sua lógica de urgência
      }));

      setMeuServicos(servicosFormatados);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      setError(err.message);
      Alert.alert(
        "Erro",
        "Não foi possível carregar os serviços. Tente novamente.",
        [
          {
            text: "Tentar Novamente",
            onPress: fetchPedidos,
          },
          {
            text: "OK",
            style: "cancel",
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar data
  const formatarData = (dataString) => {
    if (!dataString) return "Data não informada";

    try {
      const data = new Date(dataString);
      if (isNaN(data.getTime())) return "Data inválida";

      return data.toLocaleDateString("pt-BR");
    } catch (error) {
      return "Data inválida";
    }
  };

  // Função para mapear status do backend para o formato do frontend
  const mapearStatus = (status) => {
    const statusMap = {
      pendente: "Aguardando",
      em_andamento: "Andamento",
      aguardando_peca: "Aguardando peça",
      concluido: "Concluído",
      finalizado: "Concluído",
    };

    return statusMap[status?.toLowerCase()] || status || "Pendente";
  };

  // Carregar pedidos ao montar o componente
  useEffect(() => {
    fetchPedidos();
  }, []);

  const handleServicoPress = (item) => {
    console.log("Serviço visualizado:", item);
    // O modal já é aberto automaticamente pelo componente
  };

  // Função para recarregar dados (pull to refresh)
  const handleRefresh = () => {
    fetchPedidos();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <PageHeader
          title="Meus Serviços em andamento"
          containerStyle={{ backgroundColor: Colors.azulClaro }}
          titleStyle={{ color: "#fff" }}
        />

        <ScrollView
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            // Opcional: adicionar pull to refresh
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              tintColor={Colors.azulClaro}
            />
          }
        >
          <View style={styles.listaContainer}>
            <View style={styles.infoContainer}>
              <FontAwesome6
                name="info-circle"
                size={16}
                color={Colors.azulClaro}
              />
              <Text style={styles.infoText}>
                Toque em um serviço para ver mais detalhes
              </Text>
            </View>

            {loading && meuServicos.length === 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.azulClaro} />
                <Text style={styles.loadingText}>Carregando serviços...</Text>
              </View>
            ) : error && meuServicos.length === 0 ? (
              <View style={styles.errorContainer}>
                <FontAwesome6
                  name="exclamation-triangle"
                  size={48}
                  color={Colors.laranja}
                />
                <Text style={styles.errorText}>Erro ao carregar serviços</Text>
                <Text style={styles.errorSubText}>{error}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={fetchPedidos}
                >
                  <Text style={styles.retryButtonText}>Tentar Novamente</Text>
                </TouchableOpacity>
              </View>
            ) : meuServicos?.length > 0 ? (
              meuServicos.map((item) => (
                <ClientServiceCard
                  key={item.id}
                  item={item}
                  onPress={handleServicoPress}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <FontAwesome6
                  name="clipboard-list"
                  size={48}
                  color={Colors.cinzaEscuro}
                />
                <Text style={styles.emptyText}>Nenhum serviço encontrado</Text>
                <Text style={styles.emptySubText}>
                  Seus serviços aparecerão aqui quando forem agendados
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default serviceStatus;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  listaContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.grafite,
    flex: 1,
    fontFamily: "DM-Sans",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.grafite,
    textAlign: "center",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  errorText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.laranja,
    textAlign: "center",
  },
  errorSubText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.cinzaEscuro,
    textAlign: "center",
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: Colors.azulClaro,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.grafite,
    textAlign: "center",
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.cinzaEscuro,
    textAlign: "center",
    lineHeight: 20,
  },
});
