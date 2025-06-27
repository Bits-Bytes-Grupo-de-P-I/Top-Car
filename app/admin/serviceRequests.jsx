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

// COMPONENTES
import PageHeader from "@/components/PageHeader";
import SeeMoreBtn from "@/components/SeeMoreBtn";
import Button from "@/components/Button";

// CORES
import Colors from "@/constants/Colors";

const API_BASE_URL = "https://topcar-back-end.onrender.com";
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJqb2FvQGV4YW1wbGUuY29tIiwiZnVuY2FvIjoiYWRtaW4iLCJpYXQiOjE3NDg0NTQzODR9.3fxamj4FEzv265boICnC3WqcJZLiJ0Kfsmbpg9S9lFs";

const serviceRequests = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Função para buscar agendamentos da API
  const fetchAgendamentos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/agendamentos`, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Transformar os dados para o formato esperado pelo componente
        const formattedData = data.map((agendamento) => ({
          id: agendamento.id,
          cliente: {
            nome: agendamento.cliente,
          },
          veiculo: {
            modelo: agendamento.veiculo,
            placa: agendamento.placa,
          },
          resumo: agendamento.servico, // Usando o serviço como resumo
          descricao: agendamento.descricao,
          dataPedido: agendamento.dataAgendada,
          status: agendamento.status,
          urgente: agendamento.urgente,
          // Dados originais para criar o pedido
          originalData: agendamento,
        }));
        setAgendamentos(formattedData);
      } else {
        Alert.alert("Erro", "Não foi possível carregar os agendamentos");
      }
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      Alert.alert("Erro", "Erro de conexão ao buscar agendamentos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Função para buscar cliente por nome
  const findClienteByName = async (nomeCliente) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const clientes = await response.json();
        return clientes.find((cliente) => cliente.nome === nomeCliente);
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      return null;
    }
  };

  // Função para buscar veículo por placa
  const findVeiculoByPlaca = async (placa) => {
    try {
      const response = await fetch(`${API_BASE_URL}/veiculos`, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const veiculos = await response.json();
        return veiculos.find((veiculo) => veiculo.placa === placa);
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar veículo:", error);
      return null;
    }
  };

  // Carregar agendamentos ao montar o componente
  useEffect(() => {
    fetchAgendamentos();
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
      // 1) buscar cliente
      console.log(
        `🔍 Buscando cliente por nome: "${agendamento.cliente.nome}"`
      );
      const cliente = await findClienteByName(agendamento.cliente.nome);
      if (!cliente) {
        console.log("❌ Cliente não encontrado");
        Alert.alert("Erro", "Cliente não encontrado no sistema");
        return;
      }

      // 2) buscar veículo
      console.log(
        `🔍 Buscando veículo por placa: "${agendamento.veiculo.placa}"`
      );
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
        status: "pendente", // ajuste de status previamente discutido
        dataPedido: new Date().toISOString(),
      };
      console.log("✏️ Enviando POST /pedidos com:", pedidoData);

      const createResponse = await fetch(`${API_BASE_URL}/pedidos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pedidoData),
      });
      console.log("📥 createResponse.status =", createResponse.status);
      const createText = await createResponse.text();
      console.log("📄 createResponse.body =", createText);

      // 4) tratamento da resposta de criação
      if (createResponse.ok) {
        console.log(
          `✅ Pedido criado com sucesso. Agora apagando agendamento ID=${agendamento.id}`
        );

        // 5) deletar agendamento
        const deleteResponse = await fetch(
          `${API_BASE_URL}/agendamentos/${agendamento.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
              // sem Content-Type no DELETE para não gerar erro de JSON vazio
            },
          }
        );
        console.log("📥 deleteResponse.status =", deleteResponse.status);
        const deleteText = await deleteResponse.text();
        console.log("📄 deleteResponse.body =", deleteText);

        if (deleteResponse.ok) {
          Alert.alert("Sucesso", "Agendamento aceito com sucesso!");
          setModalVisible(false);
          fetchAgendamentos(); // Recarrega lista
        } else {
          console.log("❌ Falha ao deletar agendamento");
          Alert.alert("Erro", "Pedido criado, mas erro ao remover agendamento");
        }
      } else {
        console.log("❌ Falha ao criar pedido:", createText);
        let err;
        try {
          err = JSON.parse(createText);
        } catch {
          err = { error: createText };
        }
        Alert.alert(
          "Erro",
          `Não foi possível aceitar o agendamento: ${
            err.error || "Desconhecido"
          }`
        );
      }
    } catch (error) {
      console.error("🔥 Exceção em handleAccept:", error);
      Alert.alert("Erro", "Erro de conexão ao aceitar agendamento");
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
              console.log(`🗑️ Enviando DELETE para /agendamentos/${id}`);
              const response = await fetch(
                `${API_BASE_URL}/agendamentos/${id}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${AUTH_TOKEN}`,
                    // removido "Content-Type": "application/json"
                  },
                }
              );

              console.log(
                "📥 Resposta rejectResponse.status =",
                response.status
              );
              const responseText = await response.text();
              console.log("📄 rejectResponse.body =", responseText);

              if (response.ok) {
                Alert.alert("Sucesso", "Agendamento rejeitado com sucesso!");
                setModalVisible(false);
                fetchAgendamentos(); // Recarregar lista de agendamentos
              } else {
                let err;
                try {
                  err = JSON.parse(responseText);
                } catch {
                  err = { error: responseText };
                }
                console.log("❌ Erro ao rejeitar agendamento:", err);
                Alert.alert(
                  "Erro",
                  `Não foi possível rejeitar o agendamento: ${
                    err.error || err.message || "Erro desconhecido"
                  }`
                );
              }
            } catch (error) {
              console.error("🔥 Exceção em handleReject:", error);
              Alert.alert("Erro", "Erro de conexão ao rejeitar agendamento");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
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
            title="Agendamentos"
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
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.cardBody}>
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
                      <Text style={styles.modalDescricaoTitle}>
                        Descrição detalhada:
                      </Text>
                      <Text style={styles.modalDescricao}>
                        {selectedAgendamento.descricao}
                      </Text>

                    </View>

                    <View style={styles.modalDate}>
                      <Text style={styles.modalDateText}>
                        Agendado para:{" "}
                        {formatDate(selectedAgendamento.dataPedido)}
                      </Text>
                    </View>

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
