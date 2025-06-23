import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";

// Componentes
import Badge from "../Badge";
import ServiceStatus from "../ServiceStatus";
import Button from "../Button";

// ícones
import { FontAwesome6, MaterialIcons, Ionicons } from "@expo/vector-icons";

// Cores
import Colors from "@/constants/Colors";

const OngoingServiceCard = ({
  item,
  onPress,
  onUpdate,
  onFinish,
  fetchServicos,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editedService, setEditedService] = useState({
    clienteNome: item.clienteNome,
    veiculo: item.veiculo,
    placa: item.placa,
    servico: item.servico,
    dataAgendada: item.dataAgendada,
    urgente: item.urgente,
  });

  // Constantes da API
  const API_BASE_URL = "https://topcar-back-end.onrender.com";
  const AUTH_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJqb2FvQGV4YW1wbGUuY29tIiwiZnVuY2FvIjoiYWRtaW4iLCJpYXQiOjE3NDg0NTQzODR9.3fxamj4FEzv265boICnC3WqcJZLiJ0Kfsmbpg9S9lFs";

  // Função para fazer requisições HTTP
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  };

  // Função para atualizar um pedido
  const updatePedido = async (pedidoId, pedidoData) => {
    try {
      const data = await makeRequest(`${API_BASE_URL}/pedidos/${pedidoId}`, {
        method: "PUT",
        body: JSON.stringify(pedidoData),
      });
      await fetchServicos();
      return data;
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      throw error;
    }
  };

  // Função para finalizar um serviço (alterar status)
  const finalizarServico = async (pedidoId) => {
    try {
      const data = await makeRequest(`${API_BASE_URL}/pedidos/${pedidoId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "concluido" }),
      });
      return data;
    } catch (error) {
      console.error("Erro ao finalizar serviço:", error);
      throw error;
    }
  };

  // Função para formatar data do formato brasileiro para ISO
  const formatDateToISO = (dateString) => {
    if (!dateString) return null;

    try {
      // Se já estiver no formato ISO (YYYY-MM-DD), retorna como está
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
      }

      // Se estiver no formato brasileiro (DD/MM/YYYY)
      if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const [day, month, year] = dateString.split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }

      // Tentar converter outras possibilidades
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error("Data inválida");
      }

      return date.toISOString().split("T")[0]; // Retorna apenas YYYY-MM-DD
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return null;
    }
  };

  const handleFinishService = async () => {
    try {
      Alert.alert(
        "Confirmar Finalização",
        "Tem certeza que deseja finalizar este serviço?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Finalizar",
            onPress: async () => {
              try {
                setLoading(true);
                await finalizarServico(item.id);
                setModalVisible(false);

                // Chama callback para atualizar a lista
                if (onFinish) {
                  onFinish(item.id);
                }

                Alert.alert("Sucesso", "Serviço finalizado com sucesso!");
              } catch (error) {
                Alert.alert(
                  "Erro",
                  "Não foi possível finalizar o serviço. Tente novamente."
                );
                console.error("Erro ao finalizar serviço:", error);
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro inesperado. Tente novamente.");
      console.error("Erro inesperado:", error);
    }
  };

  const handleUpdateService = () => {
    setEditedService({
      clienteNome: item.clienteNome,
      veiculo: item.veiculo,
      placa: item.placa,
      servico: item.servico,
      dataAgendada: item.dataAgendada,
      urgente: item.urgente,
    });
    fetchServicos();
    setModalVisible(false);
    setEditModalVisible(true);
  };

  const validateServiceData = () => {
    if (!editedService.servico.trim()) {
      Alert.alert("Erro", "O campo 'Serviço' é obrigatório.");
      return false;
    }

    if (!editedService.dataAgendada.trim()) {
      Alert.alert("Erro", "O campo 'Data Agendada' é obrigatório.");
      return false;
    }

    // Validação básica de formato de data (DD/MM/AAAA)
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(editedService.dataAgendada)) {
      Alert.alert("Erro", "Por favor, insira a data no formato DD/MM/AAAA.");
      return false;
    }

    return true;
  };

  const saveServiceChanges = async () => {
    if (!validateServiceData()) {
      return;
    }

    try {
      setLoading(true);

      // Primeiro, buscar os dados atuais do pedido para obter cliente_id e veiculo_id
      const currentPedido = await makeRequest(
        `${API_BASE_URL}/pedidos/${item.id}`,
        {
          method: "GET",
        }
      );

      // Dados para atualizar - incluindo todos os campos obrigatórios
      const updateData = {
        cliente_id: currentPedido.cliente_id, // Mantém o cliente_id atual
        veiculo_id: currentPedido.veiculo_id, // Mantém o veiculo_id atual
        resumo: editedService.servico,
        descricao: editedService.servico,
        status: editedService.status || item.status,
        dataPedido: formatDateToISO(editedService.dataAgendada),
      };

      console.log("Dados sendo enviados para atualização:", updateData); // Para debug

      await updatePedido(item.id, updateData);

      setEditModalVisible(false);

      // Chama callback para atualizar a lista
      if (onUpdate) {
        onUpdate(item.id, {
          ...item,
          servico: editedService.servico,
          dataAgendada: editedService.dataAgendada,
          urgente: editedService.urgente,
        });
      }

      Alert.alert("Sucesso", "Serviço atualizado com sucesso!");
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível atualizar o serviço. Tente novamente."
      );
      console.error("Erro ao atualizar serviço:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditModalVisible(false);
    setEditedService({
      clienteNome: item.clienteNome,
      veiculo: item.veiculo,
      placa: item.placa,
      servico: item.servico,
      dataAgendada: item.dataAgendada,
      urgente: item.urgente,
    });
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.servicoItem, item.urgente ? styles.servicoUrgente : {}]}
        onPress={() => setEditModalVisible(true)}
        disabled={loading}
      >
        <View style={styles.servicoHeader}>
          <Text style={styles.clienteNome}>{item.clienteNome}</Text>
          {item.urgente && (
            <View style={styles.urgenteBadge}>
              <Badge color={Colors.laranja} text="Urgente" />
            </View>
          )}
        </View>
        <View style={styles.servicoInfo}>
          <View style={styles.infoRow}>
            <FontAwesome6 name="car" size={14} color={Colors.verde} />
            <Text style={styles.infoText}>
              {item.veiculo} - {item.placa}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome6 name="wrench" size={14} color={Colors.azulClaro} />
            <Text style={styles.infoText}>{item.servico}</Text>
          </View>
          {item.dataAgendada && (
            <View style={styles.infoRow}>
              <FontAwesome6 name="calendar" size={14} color={Colors.laranja} />
              <Text style={styles.infoText}>{item.dataAgendada}</Text>
            </View>
          )}
        </View>
        <View
          style={styles.statusContainer}
          onStartShouldSetResponder={() => true}
          onResponderGrant={() => {
            // Impede que o toque seja propagado para o TouchableOpacity pai
          }}
        >
          <ServiceStatus
            item={item}
            fetchServicos={fetchServicos}
            onStatusUpdate={(updatedPedido) => {
              console.log("Status atualizado:", updatedPedido);
            }}
          />
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color={Colors.azul} />
          </View>
        )}
      </TouchableOpacity>

      {/* Modal de detalhes do serviço */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes do Serviço</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
                disabled={loading}
              >
                <MaterialIcons name="close" size={24} color={Colors.grafite} />
              </Pressable>
            </View>

            <View style={styles.modalDivider} />

            {/* Informações do Cliente */}
            <View style={styles.modalClientInfo}>
              <View style={styles.clienteHeader}>
                <Text style={styles.modalClientName}>{item.clienteNome}</Text>
                {item.urgente && (
                  <View style={styles.modalUrgenteBadge}>
                    <Badge color={Colors.laranja} text="Urgente" />
                  </View>
                )}
              </View>
            </View>

            {/* Informações do Veículo */}
            <View style={styles.modalVehicleInfo}>
              <View style={styles.modalInfoRow}>
                <FontAwesome6 name="car" size={16} color={Colors.verde} />
                <Text style={styles.modalInfoText}>
                  <Text style={styles.boldText}>Veículo: </Text>
                  {item.veiculo}
                </Text>
              </View>
              <View style={styles.modalInfoRow}>
                <FontAwesome6 name="id-card" size={16} color={Colors.grafite} />
                <Text style={styles.modalInfoText}>
                  <Text style={styles.boldText}>Placa: </Text>
                  {item.placa}
                </Text>
              </View>
            </View>

            {/* Informações do Serviço */}
            <View style={styles.modalServiceInfo}>
              <View style={styles.modalInfoRow}>
                <FontAwesome6
                  name="wrench"
                  size={16}
                  color={Colors.azulClaro}
                />
                <Text style={styles.modalInfoText}>
                  <Text style={styles.boldText}>Serviço: </Text>
                  {item.servico}
                </Text>
              </View>
              <View style={styles.modalInfoRow}>
                <FontAwesome6
                  name="calendar"
                  size={16}
                  color={Colors.laranja}
                />
                <Text style={styles.modalInfoText}>
                  <Text style={styles.boldText}>Data Agendada: </Text>
                  {formatDateToISO(item.dataAgendada)}
                </Text>
              </View>
            </View>

            {/* Ações do Modal */}
            <View style={styles.modalActions}>
              <Button
                cor={Colors.azul}
                texto="Editar"
                onPress={handleUpdateService}
                disabled={loading}
              >
                <Ionicons
                  name="pencil"
                  size={18}
                  color="#FFF"
                  style={{ marginRight: 5 }}
                />
              </Button>
              <Button
                cor={Colors.verde}
                texto={loading ? "Finalizando..." : "Finalizar"}
                onPress={handleFinishService}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator
                    size={18}
                    color="white"
                    style={{ marginRight: 5 }}
                  />
                ) : (
                  <MaterialIcons
                    name="check-circle"
                    size={18}
                    color="white"
                    style={{ marginRight: 5 }}
                  />
                )}
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={cancelEdit}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Serviço</Text>
              <Pressable
                style={styles.closeButton}
                onPress={cancelEdit}
                disabled={loading}
              >
                <MaterialIcons name="close" size={24} color={Colors.grafite} />
              </Pressable>
            </View>

            <View style={styles.modalDivider} />

            {/* Campos de Edição */}
            <View style={styles.editInputContainer}>
              <Text style={styles.editInputLabel}>Serviço:</Text>
              <TextInput
                style={[styles.editInput, styles.textArea]}
                value={editedService.servico}
                onChangeText={(text) =>
                  setEditedService({ ...editedService, servico: text })
                }
                placeholder="Descrição do serviço"
                multiline={true}
                numberOfLines={3}
                maxLength={200}
                editable={!loading}
              />
            </View>

            <View style={styles.editInputContainer}>
              <Text style={styles.editInputLabel}>Data Agendada:</Text>
              <TextInput
                style={styles.editInput}
                value={editedService.dataAgendada}
                onChangeText={(text) => {
                  // Formatação automática da data enquanto digita
                  let formattedText = text.replace(/\D/g, "");
                  if (formattedText.length >= 2) {
                    formattedText = formattedText.replace(
                      /(\d{2})(\d)/,
                      "$1/$2"
                    );
                  }
                  if (formattedText.length >= 5) {
                    formattedText = formattedText.replace(
                      /(\d{2})\/(\d{2})(\d)/,
                      "$1/$2/$3"
                    );
                  }
                  if (formattedText.length > 10) {
                    formattedText = formattedText.slice(0, 10);
                  }
                  setEditedService({
                    ...editedService,
                    dataAgendada: formattedText,
                  });
                }}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                maxLength={10}
                editable={!loading}
              />
            </View>

            {/* Urgente Toggle */}
            <View style={styles.urgenteContainer}>
              <Text style={styles.editInputLabel}>Serviço Urgente:</Text>
              <TouchableOpacity
                style={[
                  styles.urgenteToggle,
                  editedService.urgente
                    ? styles.urgenteToggleActive
                    : styles.urgenteToggleInactive,
                ]}
                onPress={() =>
                  !loading &&
                  setEditedService({
                    ...editedService,
                    urgente: !editedService.urgente,
                  })
                }
                disabled={loading}
              >
                <Text
                  style={[
                    styles.urgenteToggleText,
                    editedService.urgente
                      ? styles.urgenteToggleTextActive
                      : styles.urgenteToggleTextInactive,
                  ]}
                >
                  {editedService.urgente ? "Sim" : "Não"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Ações do Modal de Edição */}
            <View style={styles.modalActions}>
              <Button
                cor={Colors.vermelho}
                texto="Cancelar"
                onPress={cancelEdit}
                disabled={loading}
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
                texto={loading ? "Salvando..." : "Salvar"}
                onPress={saveServiceChanges}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator
                    size={18}
                    color="white"
                    style={{ marginRight: 5 }}
                  />
                ) : (
                  <MaterialIcons
                    name="check-circle"
                    size={18}
                    color="white"
                    style={{ marginRight: 5 }}
                  />
                )}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default OngoingServiceCard;

const styles = StyleSheet.create({
  servicoItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  servicoUrgente: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.laranja,
  },
  servicoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  clienteNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.grafite,
    flex: 1,
  },
  urgenteBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginLeft: 8,
  },
  urgenteText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  servicoInfo: {
    marginBottom: 10,
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.cinzaEscuro,
    flex: 1,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.cinzaClaro,
    marginTop: 12,
    alignItems: "flex-end",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  statusFinalizado: {
    color: Colors.verde,
  },
  statusAndamento: {
    color: Colors.azulClaro,
  },
  statusAguardandoPeca: {
    color: Colors.laranja,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    margin: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.grafite,
    fontFamily: "DM-Sans",
  },
  closeButton: {
    padding: 5,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
    marginBottom: 16,
  },
  modalClientInfo: {
    marginBottom: 16,
  },
  clienteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalClientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.grafite,
    fontFamily: "DM-Sans",
  },
  modalUrgenteBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginLeft: 8,
  },
  modalVehicleInfo: {
    marginBottom: 16,
  },
  modalServiceInfo: {
    marginBottom: 20,
  },
  modalInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    alignItems: "flex-start",
    gap: 8,
  },
  modalInfoText: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.grafite,
    fontFamily: "DM-Sans",
    flex: 1,
  },
  boldText: {
    fontWeight: "bold",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 12,
  },
  editInputContainer: {
    marginBottom: 16,
  },
  editInputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.grafite,
    fontFamily: "DM-Sans",
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: Colors.grafite,
    borderColor: Colors.cinzaClaro,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
    minHeight: 80,
  },
  readOnlySection: {
    backgroundColor: Colors.cinzaClaro + "20",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  readOnlyTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.grafite,
    marginBottom: 8,
  },
  readOnlyText: {
    fontSize: 14,
    color: Colors.grafite,
    marginBottom: 4,
  },
  urgenteContainer: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  urgenteToggle: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    minWidth: 60,
  },
  urgenteToggleActive: {
    backgroundColor: Colors.laranja,
    borderColor: Colors.laranja,
  },
  urgenteToggleInactive: {
    backgroundColor: Colors.cinzaClaro,
    borderColor: "#ddd",
  },
  urgenteToggleText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  urgenteToggleTextActive: {
    color: "white",
  },
  urgenteToggleTextInactive: {
    color: Colors.grafite,
  },
});
