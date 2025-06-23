import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { useState } from "react";

// CoOMPONENTES
import Badge from "../Badge";

// ÍCONES
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";

// CORES
import Colors from "../../constants/Colors";

const ClientServiceCard = ({ item, onPress }) => {
  const [modalVisible, setModalVisible] = useState(false);

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

  const getStatusStyle = (status) => {
    switch (status) {
      case "Concluído":
        return styles.statusFinalizado;
      case "Andamento":
        return styles.statusAndamento;
      case "Aguardando peça":
        return styles.statusAguardandoPeca;
      default:
        return styles.statusDefault;
    }
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
          <View style={styles.infoRow}>
            <FontAwesome6 name="calendar" size={14} color={Colors.laranja} />
            <Text style={styles.infoText}>{item.dataAgendada}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, getStatusStyle(item.status)]}>
            {item.status}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Modal de detalhes do serviço - Somente visualização */}
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
              <View style={styles.modalInfoRow}>
                <FontAwesome6 name="clock" size={16} color={Colors.grafite} />
                <Text style={styles.modalInfoText}>
                  <Text style={styles.boldText}>Status: </Text>
                  <Text
                    style={[
                      styles.modalStatusText,
                      getStatusStyle(item.status),
                    ]}
                  >
                    {item.status}
                  </Text>
                </Text>
              </View>
            </View>

            {/* Informações adicionais se houver */}
            {item.observacoes && (
              <View style={styles.modalObservacoes}>
                <Text style={styles.modalObservacoesTitle}>Observações:</Text>
                <Text style={styles.modalObservacoesText}>
                  {item.observacoes}
                </Text>
              </View>
            )}

            {/* Botão apenas para fechar */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeModalButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ClientServiceCard;

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
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.cinzaClaro,
    alignItems: "flex-start",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    textAlign: "center",
  },
  statusFinalizado: {
    color: Colors.verde,
    backgroundColor: `${Colors.verde}15`,
  },
  statusAndamento: {
    color: Colors.azulClaro,
    backgroundColor: `${Colors.azulClaro}15`,
  },
  statusAguardandoPeca: {
    color: Colors.laranja,
    backgroundColor: `${Colors.laranja}15`,
  },
  statusDefault: {
    color: Colors.grafite,
    backgroundColor: `${Colors.grafite}15`,
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
    marginBottom: 16,
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
  modalStatusText: {
    fontSize: 15,
    fontWeight: "600",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  boldText: {
    fontWeight: "bold",
  },
  modalObservacoes: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  modalObservacoesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.grafite,
    marginBottom: 4,
    fontFamily: "DM-Sans",
  },
  modalObservacoesText: {
    fontSize: 14,
    color: Colors.grafite,
    lineHeight: 20,
    fontFamily: "DM-Sans",
  },
  modalActions: {
    alignItems: "center",
    marginTop: 8,
  },
  closeModalButton: {
    backgroundColor: Colors.azulClaro,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    minWidth: 120,
  },
  closeModalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "DM-Sans",
  },
});
