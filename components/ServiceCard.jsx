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
 * @param {Function} props.onEdit - Função para editar o serviço (apenas admin)
 * @param {Function} props.onDelete - Função para excluir o serviço (apenas admin)
 */
const ServiceCard = ({ service, isAdminView = false, onEdit, onDelete }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedDescription, setEditedDescription] = useState(service?.description || service?.descricao || "");

  const handleEdit = () => {
    setEditedDescription(service?.description || service?.descricao || "");
    setEditModalVisible(true);
  };

  const handleDelete = () => {
    const vehicleName = service?.vehicle || service?.veiculo_completo || `${service?.veiculo || ''} ${service?.modelo || ''}`.trim();
    Alert.alert(
      "Confirmar exclusão",
      `Deseja realmente excluir o serviço pendente para o veículo ${vehicleName}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: () => onDelete && onDelete(service?.id),
          style: "destructive",
        },
      ]
    );
  };

  const saveServiceChanges = () => {
    // Validação básica
    if (!editedDescription.trim()) {
      Alert.alert("Erro", "O campo descrição é obrigatório.");
      return;
    }

    // Chama a função de edição passada como prop
    if (onEdit) {
      onEdit(service?.id, {
        description: editedDescription.trim(),
      });
    }
    
    setEditModalVisible(false);
  };

  const cancelEdit = () => {
    // Restaura o valor original
    setEditedDescription(service?.description || service?.descricao || "");
    setEditModalVisible(false);
  };

  // Função para formatar a data
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return "Data inválida";
    }
  };

  // Verifica se o service existe
  if (!service) {
    return null;
  }

  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          {/* Informações do Cliente */}
          <View style={styles.row}>
            <Text style={styles.label}>Cliente:</Text>
            <Text style={styles.value}>
              {service.clienteName || service.cliente_nome || service.cliente || "N/A"}
            </Text>
          </View>
          
          {/* Informações do Veículo */}
          <View style={styles.row}>
            <Text style={styles.label}>Veículo:</Text>
            <Text style={styles.value}>
              {service.vehicle || service.veiculo_completo || `${service.veiculo || ''} ${service.modelo || ''}`.trim() || "N/A"}
            </Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Placa:</Text>
            <Text style={styles.value}>
              {service.licensePlate || service.placa || "N/A"}
            </Text>
          </View>
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.label}>Descrição:</Text>
            <Text style={styles.description}>
              {service.description || service.descricao || "Sem descrição"}
            </Text>
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

      {/* Modal de Edição - Simplificado para editar apenas a descrição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={cancelEdit}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Descrição do Serviço</Text>
            
            {/* Mostra informações do serviço (somente leitura) */}
            <View style={styles.readOnlyInfo}>
              <Text style={styles.readOnlyLabel}>
                Cliente: {service.clienteName || service.cliente_nome || service.cliente || 'N/A'}
              </Text>
              <Text style={styles.readOnlyLabel}>
                Veículo: {service.vehicle || service.veiculo_completo || `${service.veiculo || ''} ${service.modelo || ''}`.trim() || 'N/A'}
              </Text>
              <Text style={styles.readOnlyLabel}>
                Placa: {service.licensePlate || service.placa || 'N/A'}
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Descrição:</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedDescription}
                onChangeText={setEditedDescription}
                placeholder="Digite a descrição"
                multiline={true}
                numberOfLines={4}
                maxLength={500}
              />
              <Text style={styles.characterCount}>
                {editedDescription?.length || 0}/500 caracteres
              </Text>
            </View>

            <View style={styles.modalActions}>
              <Button
                cor={Colors.vermelho}
                texto="Cancelar"
                onPress={cancelEdit}
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

export default ServiceCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    padding: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.cinzaEscuro || "#666",
    minWidth: 60,
  },
  value: {
    fontSize: 14,
    color: Colors.preto || "#000",
    flex: 1,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: Colors.preto || "#000",
    marginTop: 4,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: Colors.preto || "#000",
  },
  readOnlyInfo: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  readOnlyLabel: {
    fontSize: 14,
    color: Colors.cinzaEscuro || "#666",
    marginBottom: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.cinzaEscuro || "#666",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.cinzaClaro || "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  characterCount: {
    fontSize: 12,
    color: Colors.cinzaEscuro || "#666",
    marginTop: 4,
    textAlign: "right",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});