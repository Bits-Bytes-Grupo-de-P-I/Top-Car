import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context"; //import para concertar a tela no celular
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import mock from "@/assets/mocks/clientAndVehiclesInfo";

import Slider from "@/components/Slider";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";

import Colors from "@/constants/Colors";

// Saporra aqui é tudo IA com dado mockado
const clientInfo = () => {
  const [client, setClient] = useState(mock.client);
  const [vehicles, setVehicles] = useState(mock.vehicles);
  const [inShop, setInShop] = useState(false);
  const [editClientModal, setEditClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState({});
  const [vehicleModal, setVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState({});
  const [editingVehicleIndex, setEditingVehicleIndex] = useState(-1);
  useEffect(() => {
    // Verificar se algum veículo está na oficina
    const checkVehiclesInShop = () => {
      const hasVehicleInShop = mock.vehicles.some((vehicle) => vehicle.inShop);
      setInShop(hasVehicleInShop);
    };

    checkVehiclesInShop();
  }, []);

  const handleEditClient = () => {
    setEditingClient({ ...client });
    setEditClientModal(true);
  };

  const saveClientChanges = () => {
    setClient(editingClient);
    setEditClientModal(false);
    Alert.alert("Sucesso", "Informações do cliente atualizadas com sucesso!");
  };

  const handleEditVehicle = (vehicle, index) => {
    setEditingVehicle({ ...vehicle });
    setEditingVehicleIndex(index);
    setVehicleModal(true);
  };

  const saveVehicleChanges = () => {
    const updatedVehicles = [...vehicles];
    updatedVehicles[editingVehicleIndex] = editingVehicle;
    setVehicles(updatedVehicles);
    setVehicleModal(false);
    Alert.alert("Sucesso", "Informações do veículo atualizadas com sucesso!");
  };

  const toggleInShop = () => {
    setInShop(!inShop);
  };

  const createServicePending = () => {
    Alert.alert(
      "Nova Pendência",
      "Criar nova pendência de serviço para este cliente?",
      [
        { text: "Cancelar" },
        {
          text: "Confirmar",
          onPress: () => router.push("/create-service-pending"),
        },
      ]
    );
  };

  const createServiceNote = () => {
    Alert.alert("Nova Nota", "Criar nova nota de serviço para este cliente?", [
      { text: "Cancelar" },
      {
        text: "Confirmar",
        onPress: () => router.push("/create-service-note"),
      },
    ]);
  };
  // Saporra aqui é tudo IA com dado mockado

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <PageHeader
          title="Serviços Pendentes da Oficina"
          containerStyle={{ backgroundColor: Colors.azulClaro }}
          titleStyle={{ color: "#fff" }}
        />
        <ScrollView style={styles.container}>
          {/* Informações do Cliente */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Dados Pessoais</Text>
              <TouchableOpacity
                onPress={handleEditClient}
                style={styles.editButton}
              >
                <MaterialIcons name="edit" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nome:</Text>
                <Text style={styles.infoValue}>{client.nome}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  {client.tipoPessoa === "fisica" ? "CPF:" : "CNPJ:"}
                </Text>
                <Text style={styles.infoValue}>{client.documento}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Telefone:</Text>
                <Text style={styles.infoValue}>{client.telefone}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>CEP:</Text>
                <Text style={styles.infoValue}>{client.cep}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Endereço:</Text>
                <Text style={styles.infoValue}>
                  {client.endereco}, {client.numero}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Bairro:</Text>
                <Text style={styles.infoValue}>{client.bairro}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cidade/Estado:</Text>
                <Text style={styles.infoValue}>
                  {client.cidade}/{client.estado}
                </Text>
              </View>
            </View>
          </View>

          {/* Status da Oficina */}
          <View style={styles.shopStatusContainer}>
            <Text style={styles.shopStatusText}>
              Cliente com veículo na oficina
            </Text>
            <Slider onValueChange={toggleInShop} value={inShop} />
          </View>

          {/* Veículos do Cliente */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Veículos</Text>

            {vehicles.map((vehicle, index) => (
              <View key={index} style={styles.vehicleCard}>
                <View style={styles.vehicleHeader}>
                  <Text style={styles.vehicleName}>
                    {vehicle.veiculo} {vehicle.modelo} ({vehicle.ano})
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleEditVehicle(vehicle, index)}
                  >
                    <MaterialIcons name="edit" size={20} color={Colors.verde} />
                  </TouchableOpacity>
                </View>

                <View style={styles.vehicleInfo}>
                  <View style={styles.vehicleInfoItem}>
                    <Text style={styles.vehicleInfoLabel}>Cor:</Text>
                    <Text style={styles.vehicleInfoValue}>{vehicle.cor}</Text>
                  </View>
                  <View style={styles.vehicleInfoItem}>
                    <Text style={styles.vehicleInfoLabel}>Placa:</Text>
                    <Text style={styles.vehicleInfoValue}>{vehicle.placa}</Text>
                  </View>
                  <View style={styles.vehicleInfoItem}>
                    <Text style={styles.vehicleInfoLabel}>Quilometragem:</Text>
                    <Text style={styles.vehicleInfoValue}>{vehicle.km} km</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Botões de Ação */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              // onPress={createServicePending}
            >
              <FontAwesome5 name="clipboard-list" size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>Nova Pendência</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.noteButton]}
              // onPress={createServiceNote}
            >
              <FontAwesome5 name="file-alt" size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>Nova Nota</Text>
            </TouchableOpacity>
          </View>

          {/* Modal para editar informações do cliente */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={editClientModal}
            onRequestClose={() => setEditClientModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Editar Cliente</Text>

                <Text style={styles.inputLabel}>Nome</Text>
                <TextInput
                  style={styles.input}
                  value={editingClient.nome}
                  onChangeText={(text) =>
                    setEditingClient({ ...editingClient, nome: text })
                  }
                />

                <Text style={styles.inputLabel}>
                  {editingClient.tipoPessoa === "fisica" ? "CPF" : "CNPJ"}
                </Text>
                <TextInput
                  style={styles.input}
                  value={editingClient.documento}
                  onChangeText={(text) =>
                    setEditingClient({ ...editingClient, documento: text })
                  }
                  keyboardType="numeric"
                />

                <Text style={styles.inputLabel}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  value={editingClient.telefone}
                  onChangeText={(text) =>
                    setEditingClient({ ...editingClient, telefone: text })
                  }
                  keyboardType="phone-pad"
                />

                <Text style={styles.inputLabel}>CEP</Text>
                <TextInput
                  style={styles.input}
                  value={editingClient.cep}
                  onChangeText={(text) =>
                    setEditingClient({ ...editingClient, cep: text })
                  }
                  keyboardType="numeric"
                />

                <Text style={styles.inputLabel}>Endereço</Text>
                <TextInput
                  style={styles.input}
                  value={editingClient.endereco}
                  onChangeText={(text) =>
                    setEditingClient({ ...editingClient, endereco: text })
                  }
                />

                <Text style={styles.inputLabel}>Número</Text>
                <TextInput
                  style={styles.input}
                  value={editingClient.numero}
                  onChangeText={(text) =>
                    setEditingClient({ ...editingClient, numero: text })
                  }
                />

                <Text style={styles.inputLabel}>Bairro</Text>
                <TextInput
                  style={styles.input}
                  value={editingClient.bairro}
                  onChangeText={(text) =>
                    setEditingClient({ ...editingClient, bairro: text })
                  }
                />

                <Text style={styles.inputLabel}>Cidade</Text>
                <TextInput
                  style={styles.input}
                  value={editingClient.cidade}
                  onChangeText={(text) =>
                    setEditingClient({ ...editingClient, cidade: text })
                  }
                />

                <Text style={styles.inputLabel}>Estado</Text>
                <TextInput
                  style={styles.input}
                  value={editingClient.estado}
                  onChangeText={(text) =>
                    setEditingClient({ ...editingClient, estado: text })
                  }
                  maxLength={2}
                />

                <View style={styles.modalButtons}>
                  <Button
                    cor="vermelho"
                    texto="Cancelar"
                    onPress={() => setEditClientModal(false)}
                  />
                  <Button
                    cor="verde"
                    texto="Cancelar"
                    onPress={saveClientChanges}
                  />
                </View>
              </View>
            </View>
          </Modal>
          {/* Fim Modal para editar informações do cliente */}

          {/* Modal para editar informações do veículo */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={vehicleModal}
            onRequestClose={() => setVehicleModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Editar Veículo</Text>

                <Text style={styles.inputLabel}>Veículo</Text>
                <TextInput
                  style={styles.input}
                  value={editingVehicle.veiculo}
                  onChangeText={(text) =>
                    setEditingVehicle({ ...editingVehicle, veiculo: text })
                  }
                />

                <Text style={styles.inputLabel}>Modelo</Text>
                <TextInput
                  style={styles.input}
                  value={editingVehicle.modelo}
                  onChangeText={(text) =>
                    setEditingVehicle({ ...editingVehicle, modelo: text })
                  }
                />

                <Text style={styles.inputLabel}>Ano</Text>
                <TextInput
                  style={styles.input}
                  value={editingVehicle.ano}
                  onChangeText={(text) =>
                    setEditingVehicle({ ...editingVehicle, ano: text })
                  }
                  keyboardType="numeric"
                />

                <Text style={styles.inputLabel}>Cor</Text>
                <TextInput
                  style={styles.input}
                  value={editingVehicle.cor}
                  onChangeText={(text) =>
                    setEditingVehicle({ ...editingVehicle, cor: text })
                  }
                />

                <Text style={styles.inputLabel}>Quilometragem (KM)</Text>
                <TextInput
                  style={styles.input}
                  value={
                    editingVehicle.km !== undefined
                      ? String(editingVehicle.km)
                      : ""
                  }
                  onChangeText={(text) =>
                    setEditingVehicle({ ...editingVehicle, km: text })
                  }
                  keyboardType="numeric"
                />

                <Text style={styles.inputLabel}>Placa</Text>
                <TextInput
                  style={styles.input}
                  value={editingVehicle.placa}
                  onChangeText={(text) =>
                    setEditingVehicle({ ...editingVehicle, placa: text })
                  }
                />

                <View style={styles.modalButtons}>
                  <Button
                    cor="vermelho"
                    texto="Cancelar"
                    onPress={() => setVehicleModal(false)}
                  />
                  <Button
                    cor="verde"
                    texto="Cancelar"
                    onPress={saveVehicleChanges}
                  />
                </View>
              </View>
            </View>
          </Modal>
          {/* Fim Modal para editar informações do veículo */}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    backgroundColor: Colors.azulClaro,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    fontFamily: "DM-Sans",
    marginBottom: 8,
  },
  editButton: {
    padding: 5,
  },
  infoContainer: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    width: 100,
    fontSize: 15,
    color: Colors.cinzaClaro,
    fontWeight: "500",
    fontFamily: "DM-Sans",
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: "white",
    fontFamily: "DM-Sans",
  },
  shopStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.azulClaro,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  shopStatusText: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
    fontFamily: "DM-Sans",
  },
  vehicleCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  vehicleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "DM-Sans",
  },
  vehicleInfo: {
    marginLeft: 5,
  },
  vehicleInfoItem: {
    flexDirection: "row",
    marginBottom: 5,
  },
  vehicleInfoLabel: {
    width: 100,
    fontSize: 14,
    color: "#666",
    fontFamily: "DM-Sans",
  },
  vehicleInfoValue: {
    fontSize: 14,
    color: "#333",
    fontFamily: "DM-Sans",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginVertical: 20,
  },
  actionButton: {
    backgroundColor: Colors.azul,
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 10,
  },
  noteButton: {
    backgroundColor: Colors.verde,
    marginRight: 0,
  },
  actionButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 10,
    fontSize: 15,
    fontFamily: "DM-Sans",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    margin: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "DM-Sans",
  },
  inputLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    fontFamily: "DM-Sans",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  modalButton: {
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "#F2F2F2",
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#4285F4",
  },
  modalButtonText: {
    fontWeight: "bold",
    color: "#333",
    fontFamily: "DM-Sans",
  },
});

export default clientInfo;
