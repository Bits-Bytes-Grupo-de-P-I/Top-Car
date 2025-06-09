import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
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

const OngoingServiceCard = ({ item, onPress }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedService, setEditedService] = useState({
    clienteNome: item.clienteNome,
    veiculo: item.veiculo,
    placa: item.placa,
    servico: item.servico,
    dataAgendada: item.dataAgendada,
    urgente: item.urgente,
  });

  const handleCardPress = () => {
    setModalVisible(true);
    if (onPress) onPress(item);
  };

  const formatDate = (dateString) => {
    // Se já estiver no formato brasileiro, retorna como está
    if (dateString.includes("/")) {
      return dateString;
    }
    // Caso contrário, formata a data
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleFinishService = () => {
    console.log(`Serviço ${item.id} finalizado`);
    setModalVisible(false);
    // Aqui você implementaria a lógica para finalizar o serviço
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
    setModalVisible(false);
    setEditModalVisible(true);
  };

  const saveServiceChanges = () => {
    console.log("Serviço atualizado:", editedService);
    setEditModalVisible(false);
    // Aqui você implementaria a lógica para salvar as alterações
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.servicoItem, item.urgente ? styles.servicoUrgente : {}]}
        onPress={handleCardPress}
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
            // Impede que o toque seja propagado para o TouchableOpacity pai, fazendo com que abra o card ao invés do dropdown
          }}
        >
          <ServiceStatus />
        </View>
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
                  {formatDate(item.dataAgendada)}
                </Text>
              </View>
            </View>

            {/* Ações do Modal */}
            <View style={styles.modalActions}>
              <Button
                cor={Colors.azul}
                texto="Editar"
                onPress={handleUpdateService}
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
                texto="Finalizar"
                onPress={handleFinishService}
              >
                <MaterialIcons
                  name="check-circle"
                  size={18}
                  color="white"
                  style={{ marginRight: 5 }}
                />
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
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Serviço</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setEditModalVisible(false)}
              >
                <MaterialIcons name="close" size={24} color={Colors.grafite} />
              </Pressable>
            </View>

            <View style={styles.modalDivider} />

            {/* Campos de Edição */}
            <View style={styles.editInputContainer}>
              <Text style={styles.editInputLabel}>Cliente:</Text>
              <TextInput
                style={styles.editInput}
                value={editedService.clienteNome}
                onChangeText={(text) =>
                  setEditedService({ ...editedService, clienteNome: text })
                }
                placeholder="Nome do cliente"
              />
            </View>

            <View style={styles.editInputContainer}>
              <Text style={styles.editInputLabel}>Veículo:</Text>
              <TextInput
                style={styles.editInput}
                value={editedService.veiculo}
                onChangeText={(text) =>
                  setEditedService({ ...editedService, veiculo: text })
                }
                placeholder="Modelo do veículo"
              />
            </View>

            <View style={styles.editInputContainer}>
              <Text style={styles.editInputLabel}>Placa:</Text>
              <TextInput
                style={styles.editInput}
                value={editedService.placa}
                onChangeText={(text) =>
                  setEditedService({ ...editedService, placa: text })
                }
                placeholder="Placa do veículo"
              />
            </View>

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
              />
            </View>

            <View style={styles.editInputContainer}>
              <Text style={styles.editInputLabel}>Data Agendada:</Text>
              <TextInput
                style={styles.editInput}
                value={editedService.dataAgendada}
                onChangeText={(text) =>
                  setEditedService({ ...editedService, dataAgendada: text })
                }
                placeholder="DD/MM/AAAA"
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
                  setEditedService({
                    ...editedService,
                    urgente: !editedService.urgente,
                  })
                }
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
                onPress={() => setEditModalVisible(false)}
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
                texto="Salvar"
                onPress={saveServiceChanges}
              >
                <MaterialIcons
                  name="check-circle"
                  size={18}
                  color="white"
                  style={{ marginRight: 5 }}
                />
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
  },
  urgenteBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  urgenteText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  servicoInfo: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.cinzaEscuro,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.cinzaClaro,
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
  // Estilos do Modal
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
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  },
  modalClientInfo: {
    marginBottom: 16,
  },
  clienteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  },
  modalInfoText: {
    marginLeft: 12,
    fontSize: 15,
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
  },
  // Estilos do Modal de Edição
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
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  urgenteContainer: {
    marginBottom: 20,
  },
  urgenteToggle: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  urgenteToggleActive: {
    backgroundColor: Colors.laranja,
    borderColor: Colors.laranja,
  },
  urgenteToggleInactive: {
    backgroundColor: "#f9f9f9",
    borderColor: "#ddd",
  },
  urgenteToggleText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  urgenteToggleTextActive: {
    color: "white",
  },
  urgenteToggleTextInactive: {
    color: Colors.grafite,
  },
});
