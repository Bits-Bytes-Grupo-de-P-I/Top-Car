import { View, Text, StyleSheet, Alert, Modal, TextInput } from "react-native";
import { useState } from "react";
// COMPONENTES
import Button from "@/components/Button";
// ÍCONES
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// CORES
import Colors from "@/constants/Colors";

/**
 * Componente de card de serviço para exibir serviços pendentes
 *
 * @param {Object} props
 * @param {Object} props.service - Dados do serviço pendente
 * @param {boolean} props.isAdminView - Define se o card está sendo usado na visão de administrador
 * @param {boolean} props.isAccepted - Define se o serviço foi aceito ou não
 * @param {Function} props.onEdit - Função para editar o serviço (apenas admin)
 * @param {Function} props.onDelete - Função para excluir o serviço (apenas admin)
 */
const ServiceCard = ({ service, isAdminView = false, onEdit, onDelete }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedService, setEditedService] = useState({
    vehicle: service.vehicle,
    licensePlate: service.licensePlate,
    description: service.description,
  });

  const handleEdit = () => {
    setEditedService({
      vehicle: service.vehicle,
      licensePlate: service.licensePlate,
      description: service.description,
    });
    setEditModalVisible(true);
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar exclusão",
      `Deseja realmente excluir o serviço pendente para o veículo ${service.vehicle}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: () => onDelete && onDelete(service.id),
          style: "destructive",
        },
      ]
    );
  };

  const saveServiceChanges = () => {
    if (onEdit) {
      onEdit(service.id, editedService);
    }
    setEditModalVisible(false);
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.row}>
            <Text style={styles.label}>Veículo:</Text>
            <Text style={styles.value}>{service.vehicle}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Placa:</Text>
            <Text style={styles.value}>{service.licensePlate}</Text>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.label}>Descrição:</Text>
            <Text style={styles.description}>{service.description}</Text>
          </View>
          {/* Botões de ação apenas para a visão de administrador */}
          {isAdminView && (
            <View style={styles.actions}>
              <Button texto="Editar" cor={Colors.azul} onPress={handleEdit}>
                <Ionicons
                  name="pencil"
                  size={18}
                  color="#FFF"
                  style={{ marginRight: 5 }}
                />
              </Button>
              <Button
                texto="Excluir"
                cor={Colors.vermelho}
                onPress={handleDelete}
              >
                <Ionicons
                  name="trash"
                  size={18}
                  color="#FFF"
                  style={{ marginRight: 5 }}
                />
              </Button>
            </View>
          )}
        </View>
      </View>

      {/* Modal de Edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Serviço</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Veículo:</Text>
              <TextInput
                style={styles.input}
                value={editedService.vehicle}
                onChangeText={(text) =>
                  setEditedService({ ...editedService, vehicle: text })
                }
                placeholder="Digite o veículo"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Placa:</Text>
              <TextInput
                style={styles.input}
                value={editedService.licensePlate}
                onChangeText={(text) =>
                  setEditedService({ ...editedService, licensePlate: text })
                }
                placeholder="Digite a placa"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Descrição:</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedService.description}
                onChangeText={(text) =>
                  setEditedService({ ...editedService, description: text })
                }
                placeholder="Digite a descrição"
                multiline={true}
                numberOfLines={4}
              />
            </View>

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

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 8,
    color: "#333",
  },
  value: {
    fontSize: 14,
    color: "#444",
    flex: 1,
  },
  descriptionContainer: {
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
  },
  editButton: {
    borderWidth: 1,
    borderColor: Colors.azul,
    backgroundColor: Colors.azul,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: Colors.vermelho,
    backgroundColor: Colors.vermelho,
  },
  actionText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  modalUrgenteBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  // Estilos do Modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
});

export default ServiceCard;