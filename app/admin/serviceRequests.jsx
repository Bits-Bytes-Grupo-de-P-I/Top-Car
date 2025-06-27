// Tela para visualizar os agendamentos e aceitar/rejeitar

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  Modal,
  Pressable,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

// COMPONENTES
import PageHeader from "@/components/PageHeader";
import SeeMoreBtn from "@/components/SeeMoreBtn";
import Button from "@/components/Button";

// CORES
import Colors from "@/constants/Colors";

const API_BASE_URL = "https://topcar-back-end.onrender.com";

const serviceRequests = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [authToken, setAuthToken] = useState("");

  // Função para obter token de autenticação
  const getAuthToken = async () => {
    try {
      // Tente obter do AsyncStorage primeiro
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setAuthToken(token);
        return token;
      }
      
      // Fallback para o token hardcoded (remova em produção)
      const fallbackToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJqb2FvQGV4YW1wbGUuY29tIiwiZnVuY2FvIjoiYWRtaW4iLCJpYXQiOjE3NDg0NTQzODR9.3fxamj4FEzv265boICnC3WqcJZLiJ0Kfsmbpg9S9lFs";
      setAuthToken(fallbackToken);
      return fallbackToken;
    } catch (error) {
      console.error("Erro ao obter token:", error);
      return null;
    }
  };

  // Função para fazer requisições com tratamento de erro melhorado
  const makeAuthenticatedRequest = async (url, options = {}) => {
    const token = authToken || await getAuthToken();
    
    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    // Só adiciona Content-Type se houver body
    if (options.body && options.method !== 'DELETE') {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorJson.message || errorText;
      } catch {
        errorMessage = errorText || `Erro HTTP ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }

    // Para DELETE, pode não ter conteúdo
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  };

  // Função para buscar agendamentos da API
  const fetchAgendamentos = async () => {
    try {
      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/agendamentos`);
      
      // Validar se data é um array
      if (!Array.isArray(data)) {
        console.warn("Dados recebidos não são um array:", data);
        setAgendamentos([]);
        return;
      }

      // Transformar os dados para o formato esperado pelo componente
      const formattedData = data.map((agendamento) => ({
        id: agendamento.id,
        cliente: {
          nome: agendamento.cliente || "Cliente não informado",
        },
        veiculo: {
          modelo: agendamento.veiculo || "Modelo não informado",
          placa: agendamento.placa || "Placa não informada",
        },
        resumo: agendamento.servico || agendamento.resumo || "Serviço não especificado",
        descricao: agendamento.descricao || "Descrição não disponível",
        dataPedido: agendamento.dataAgendada || agendamento.dataPedido || new Date().toISOString(),
        status: agendamento.status || "pendente",
        urgente: agendamento.urgente || false,
        // Dados originais para referência
        originalData: agendamento,
      }));
      
      setAgendamentos(formattedData);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      Alert.alert("Erro", `Não foi possível carregar os agendamentos: ${error.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Função para buscar cliente por nome
  const findClienteByName = async (nomeCliente) => {
    try {
      const clientes = await makeAuthenticatedRequest(`${API_BASE_URL}/clientes`);
      
      if (!Array.isArray(clientes)) {
        console.warn("Lista de clientes não é um array:", clientes);
        return null;
      }
      
      return clientes.find((cliente) => 
        cliente.nome && cliente.nome.toLowerCase() === nomeCliente.toLowerCase()
      );
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      return null;
    }
  };

  // Função para buscar veículo por placa
  const findVeiculoByPlaca = async (placa) => {
    try {
      const veiculos = await makeAuthenticatedRequest(`${API_BASE_URL}/veiculos`);
      
      if (!Array.isArray(veiculos)) {
        console.warn("Lista de veículos não é um array:", veiculos);
        return null;
      }
      
      return veiculos.find((veiculo) => 
        veiculo.placa && veiculo.placa.toLowerCase() === placa.toLowerCase()
      );
    } catch (error) {
      console.error("Erro ao buscar veículo:", error);
      return null;
    }
  };

  // Inicializar token e carregar agendamentos
  useEffect(() => {
    const initializeData = async () => {
      await getAuthToken();
      await fetchAgendamentos();
    };
    
    initializeData();
  }, []);

  // Função para refresh da lista
  const onRefresh = () => {
    setRefreshing(true);
    fetchAgendamentos();
  };

  const handleSeeMoreBtn = (agendamento) => {
    setSelectedAgendamento(agendamento);
    setModalVisible(true);
  };

  // Função para aceitar agendamento (criar pedido e deletar agendamento)
  const handleAccept = async (agendamento) => {
    console.log("→ handleAccept chamado com agendamento:", agendamento);

    try {
      setLoading(true);

      // 1) buscar cliente
      console.log(`🔍 Buscando cliente por nome: "${agendamento.cliente.nome}"`);
      const cliente = await findClienteByName(agendamento.cliente.nome);
      if (!cliente) {
        console.log("❌ Cliente não encontrado");
        Alert.alert("Erro", "Cliente não encontrado no sistema");
        return;
      }

      // 2) buscar veículo
      console.log(`🔍 Buscando veículo por placa: "${agendamento.veiculo.placa}"`);
      const veiculo = await findVeiculoByPlaca(agendamento.veiculo.placa);
      if (!veiculo) {
        console.log("❌ Veículo não encontrado");
        Alert.alert("Erro", "Veículo não encontrado no sistema");
        return;
      }

      // 3) criar pedido
      const pedidoData = {
        cliente_id: cliente.id,
        veiculo_id: veiculo.id,
        resumo: agendamento.resumo,
        descricao: agendamento.descricao,
        status: "pendente",
        dataPedido: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
      };
      
      console.log("✏️ Enviando POST /pedidos com:", pedidoData);

      await makeAuthenticatedRequest(`${API_BASE_URL}/pedidos`, {
        method: "POST",
        body: JSON.stringify(pedidoData),
      });

      console.log("✅ Pedido criado com sucesso. Agora apagando agendamento ID =", agendamento.id);

      // 4) deletar agendamento
      await makeAuthenticatedRequest(`${API_BASE_URL}/agendamentos/${agendamento.id}`, {
        method: "DELETE",
      });

      console.log("✅ Agendamento deletado com sucesso");
      
      Alert.alert("Sucesso", "Agendamento aceito com sucesso!");
      setModalVisible(false);
      fetchAgendamentos(); // Recarrega lista
      
    } catch (error) {
      console.error("🔥 Exceção em handleAccept:", error);
      Alert.alert("Erro", `Não foi possível aceitar o agendamento: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Função para rejeitar agendamento (deletar)
  const handleReject = async (id) => {
    console.log("→ handleReject chamado com ID:", id);

    Alert.alert(
      "Confirmar Rejeição",
      "Tem certeza que deseja rejeitar este agendamento?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Rejeitar",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              console.log(`🗑️ Enviando DELETE para /agendamentos/${id}`);
              
              await makeAuthenticatedRequest(`${API_BASE_URL}/agendamentos/${id}`, {
                method: "DELETE",
              });

              console.log("✅ Agendamento rejeitado com sucesso");
              
              Alert.alert("Sucesso", "Agendamento rejeitado com sucesso!");
              setModalVisible(false);
              fetchAgendamentos(); // Recarregar lista de agendamentos
              
            } catch (error) {
              console.error("🔥 Exceção em handleReject:", error);
              Alert.alert("Erro", `Não foi possível rejeitar o agendamento: ${error.message}`);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      
      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        return "Data inválida";
      }
      
      return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()} ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
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
            title="Pedidos de Serviço"
            containerStyle={{ backgroundColor: Colors.azulClaro }}
            titleStyle={{ color: "#fff" }}
          />
          <View
            style={[
              styles.container,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <Text style={styles.loadingText}>Carregando agendamentos...</Text>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <PageHeader
          title="Agendamentos"
          containerStyle={{ backgroundColor: Colors.azulClaro }}
          titleStyle={{ color: "#fff" }}
        />
        <ScrollView
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.container}>
            {agendamentos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Nenhum agendamento encontrado
                </Text>
              </View>
            ) : (
              agendamentos.map((agendamento) => (
                <View key={agendamento.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.clientInfo}>
                      <Text style={styles.clientName}>
                        {agendamento.cliente.nome}
                      </Text>
                      <Text style={styles.vehicleModel}>
                        {agendamento.veiculo.modelo} (
                        {agendamento.veiculo.placa})
                      </Text>
                    </View>
                    <View style={styles.dateContainer}>
                      <Text style={styles.date}>
                        {formatDate(agendamento.dataPedido)}
                      </Text>
                      {agendamento.urgente && (
                        <View style={styles.urgentBadge}>
                          <Text style={styles.urgentText}>URGENTE</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.cardBody}>
                    <View style={styles.resumoContainer}>
                      <FontAwesome 
                        name="wrench" 
                        size={16} 
                        color={Colors.grafite} 
                        style={styles.icon}
                      />
                      <Text style={styles.resumoText} numberOfLines={2}>
                        {agendamento.resumo}
                      </Text>
                    </View>
                    <SeeMoreBtn onPress={() => handleSeeMoreBtn(agendamento)} />
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Modal de detalhes do agendamento */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {selectedAgendamento && (
                  <>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>
                        Detalhes do Agendamento
                      </Text>
                      <Pressable
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                      >
                        <MaterialIcons name="close" size={24} color="black" />
                      </Pressable>
                    </View>

                    <View style={styles.modalDivider} />

                    <ScrollView style={{ maxHeight: 400 }}>
                      <View style={styles.modalClientInfo}>
                        <Text style={styles.modalClientName}>
                          {selectedAgendamento.cliente.nome}
                        </Text>
                      </View>

                      <View style={styles.modalVehicleInfo}>
                        <Text style={styles.modalVehicleModel}>
                          <Text style={styles.boldText}>Veículo: </Text>
                          {selectedAgendamento.veiculo.modelo}
                        </Text>
                        <Text style={styles.modalVehiclePlate}>
                          <Text style={styles.boldText}>Placa: </Text>
                          {selectedAgendamento.veiculo.placa}
                        </Text>
                      </View>

                      <View style={styles.modalContent}>
                        <Text style={styles.modalResumoTitle}>
                          Serviço:
                        </Text>
                        <Text style={styles.modalResumo}>
                          {selectedAgendamento.resumo}
                        </Text>

                        <Text style={styles.modalDescricaoTitle}>
                          Descrição detalhada:
                        </Text>
                        <Text style={styles.modalDescricao}>
                          {selectedAgendamento.descricao}
                        </Text>
                      </View>

                      {selectedAgendamento.urgente && (
                        <View style={styles.modalUrgentContainer}>
                          <MaterialIcons name="warning" size={20} color={Colors.vermelho} />
                          <Text style={styles.modalUrgentText}>
                            AGENDAMENTO URGENTE
                          </Text>
                        </View>
                      )}

                      <View style={styles.modalDate}>
                        <Text style={styles.modalDateText}>
                          Agendado para: {formatDate(selectedAgendamento.dataPedido)}
                        </Text>
                      </View>
                    </ScrollView>

                    <View style={styles.modalActions}>
                      <Button
                        cor={Colors.vermelho}
                        texto="Rejeitar"
                        onPress={() => handleReject(selectedAgendamento.id)}
                      >
                        <MaterialIcons
                          name="cancel"
                          size={18}
                          color="white"
                          style={{ marginRight: 5 }}
                        />
                      </Button>
                      <Button
                        cor={Colors.verde}
                        texto="Aceitar"
                        onPress={() => handleAccept(selectedAgendamento)}
                      >
                        <MaterialIcons
                          name="check-circle"
                          size={18}
                          color="white"
                          style={{ marginRight: 5 }}
                        />
                      </Button>
                    </View>
                  </>
                )}
              </View>
            </View>
          </Modal>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default serviceRequests;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.grafite,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.grafite,
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.grafite,
    marginBottom: 4,
  },
  vehicleModel: {
    fontSize: 14,
    color: Colors.grafite,
    opacity: 0.7,
  },
  dateContainer: {
    alignItems: "flex-end",
  },
  date: {
    fontSize: 12,
    color: Colors.grafite,
    opacity: 0.6,
  },
  urgentBadge: {
    backgroundColor: Colors.vermelho,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  urgentText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resumoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  resumoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.grafite,
  },
  // Estilos do Modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "80%",
    width: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.grafite,
  },
  closeButton: {
    padding: 5,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginBottom: 15,
  },
  modalClientInfo: {
    marginBottom: 15,
  },
  modalClientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.grafite,
  },
  modalVehicleInfo: {
    marginBottom: 15,
  },
  modalVehicleModel: {
    fontSize: 16,
    color: Colors.grafite,
    marginBottom: 5,
  },
  modalVehiclePlate: {
    fontSize: 16,
    color: Colors.grafite,
  },
  boldText: {
    fontWeight: "bold",
  },
  modalContent: {
    marginBottom: 15,
  },
  modalResumoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.grafite,
    marginBottom: 5,
  },
  modalResumo: {
    fontSize: 14,
    color: Colors.grafite,
    marginBottom: 15,
  },
  modalDescricaoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.grafite,
    marginBottom: 5,
  },
  modalDescricao: {
    fontSize: 14,
    color: Colors.grafite,
    marginBottom: 15,
  },
  modalStatusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.grafite,
    marginBottom: 5,
  },
  modalStatus: {
    fontSize: 14,
    color: Colors.grafite,
    marginBottom: 15,
  },
  modalUrgentContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE5E5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalUrgentText: {
    color: Colors.vermelho,
    fontWeight: "bold",
    marginLeft: 5,
  },
  modalDate: {
    marginBottom: 20,
  },
  modalDateText: {
    fontSize: 14,
    color: Colors.grafite,
    opacity: 0.7,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },
});