// Tela para visualizar as informações de um cliente específico

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ImageBackground,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// COMPONENTES
import Slider from "@/components/Slider";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";

// ÍCONES
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";

// CORES
import Colors from "@/constants/Colors";

// Funções de formatação/máscara (que eu fui muito burro pra fazer sozinho foi mal família)
const formatPhone = (phone) => {
  if (!phone) return "";

  // Remove tudo que não é número
  const numbers = phone?.replace(/\D/g, "");

  // Aplica a máscara baseada no tamanho
  if (numbers?.length <= 10) {
    // Telefone fixo: (11) 1234-5678
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else {
    // Celular: (11) 91234-5678
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
};

const formatCEP = (cep) => {
  if (!cep) return "";

  // Remove tudo que não é número
  const numbers = cep.replace(/\D/g, "");

  // Aplica a máscara: 12345-678
  return numbers.replace(/(\d{5})(\d{3})/, "$1-$2");
};

const removePhoneMask = (phone) => {
  return phone ? phone.replace(/\D/g, "") : "";
};

const removeCEPMask = (cep) => {
  return cep ? cep.replace(/\D/g, "") : "";
};

const clientInfo = () => {
  // Receber os parâmetros da navegação
  const params = useLocalSearchParams();

  // Inicializar o estado do cliente com os dados recebidos
  const [client, setClient] = useState({
    id: Date.now(), // Gerar um ID temporário
    nome: params.nome || "",
    documento: params.cpf || "",
    email: params.email || "",
    tipoPessoa: params.tipo_pessoa || "fisica",
    telefone: params.telefone || "",
    cep: params.cep || "",
    endereco: params.endereco || "",
    numero: params.numero || "",
    bairro: params.bairro || "",
    cidade: params.cidade || "",
    estado: params.estado || "",
    funcao: params.funcao || "",
  });

  // Dados formatados
  const telefoneFormatado = client.telefone;

  const [vehicles, setVehicles] = useState([
    // Dados mockados para teste
    {
      id: 1,
      veiculo: "Toyota",
      modelo: "Corolla",
      ano: "2020",
      cor: "Prata",
      km: "35000",
      placa: "ABC1D23",
      clientId: 101,
      inShop: false,
    },
    {
      id: 2,
      veiculo: "Honda",
      modelo: "Civic",
      ano: "2018",
      cor: "Preto",
      km: "58000",
      placa: "XYZ4E56",
      clientId: 101,
      inShop: true,
    },
    {
      id: 3,
      veiculo: "Volkswagen",
      modelo: "Gol",
      ano: "2015",
      cor: "Branco",
      km: "90000",
      placa: "JKL7F89",
      clientId: 101,
      inShop: false,
    },
  ]);

  const [inShop, setInShop] = useState(false);
  const [editClientModal, setEditClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState({});
  const [vehicleModal, setVehicleModal] = useState(false);
  const [newVehicleModal, setNewVehicleModal] = useState(false);
  const [pendingServiceModal, setPendingServiceModal] = useState(false);
  const [addingVehicle, setAddingVehicle] = useState({});
  const [addingService, setAddingService] = useState({});
  const [editingVehicle, setEditingVehicle] = useState({});
  const [editingVehicleIndex, setEditingVehicleIndex] = useState(-1);
  const [isVehicleFocus, setIsVehicleFocus] = useState(false);

  const [isLoading, setIsLoading] = useState(false); // state para definir carregamento de informações

  useEffect(() => {
    // Verificar se algum veículo está na oficina
    const checkVehiclesInShop = () => {
      const hasVehicleInShop = vehicles.some((vehicle) => vehicle.inShop);
      setInShop(hasVehicleInShop);
    };

    checkVehiclesInShop();
  }, [vehicles]); // Dependência alterada para vehicles

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

  // Função para abrir o modal de adicionar veículo
  const openAddVehicleModal = () => {
    // Limpar o estado do veículo sendo adicionado
    setAddingVehicle({
      veiculo: "",
      modelo: "",
      ano: "",
      cor: "",
      km: "",
      placa: "",
    });
    setNewVehicleModal(true);
  };

  // Função do dropdown
  const getVehicleDropdownData = () => {
    return vehicles.map((vehicle) => ({
      label: `${vehicle.veiculo} ${vehicle.modelo} (${vehicle.ano}) - ${vehicle.placa}`,
      value: vehicle.id,
      vehicle: vehicle,
    }));
  };

  // Função para cancelar adição (limpa os dados e fecha modal)
  const cancelAddVehicle = () => {
    setAddingVehicle({});
    setNewVehicleModal(false);
  };

  // Função para salvar novo veículo
  const saveNewVehicle = () => {
    // Validação básica
    if (!addingVehicle.veiculo || !addingVehicle.modelo || !addingVehicle.ano) {
      Alert.alert(
        "Erro",
        "Por favor, preencha pelo menos Veículo, Modelo e Ano."
      );
      return;
    }

    // Criar um novo veículo com ID único
    const newVehicle = {
      id: Date.now(),
      veiculo: addingVehicle.veiculo,
      modelo: addingVehicle.modelo,
      ano: addingVehicle.ano,
      cor: addingVehicle.cor || "",
      km: addingVehicle.km || "0",
      placa: addingVehicle.placa || "",
      clientId: client.id,
      inShop: false,
    };

    // Adicionar o novo veículo à lista
    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);

    // Limpar estados e fechar modal
    setAddingVehicle({});
    setNewVehicleModal(false);

    Alert.alert("Sucesso", "Veículo adicionado com sucesso!");
  };

  const toggleInShop = () => {
    setInShop(!inShop);
  };

  // BOTÃO DE ADICIONAR
  const renderAddButton = (section) => (
    <TouchableOpacity style={styles.addButton} onPress={openAddVehicleModal}>
      <Ionicons name="add-circle-outline" size={24} color={Colors.verde} />
      <Text style={styles.addButtonText}>Adicionar Veículo</Text>
    </TouchableOpacity>
  );

  // Modal para adicionar um serviço pendente vinculado ao cliente
  const createServicePending = () => {
    setPendingServiceModal(true);
  };

  // Função para cancelar a criação do serviço
  const cancelAddService = () => {
    setAddingService({});
    setIsVehicleFocus(false);
    setPendingServiceModal(false);
  };

  // Função para salvar o novo serviço pendente
  const saveServiceChanges = () => {
    // Validação básica
    if (!addingService.vehicleId || !addingService.description) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Encontrar o veículo selecionado
    const selectedVehicle = vehicles.find(
      (v) => v.id === addingService.vehicleId
    );

    // Aqui você pode implementar a lógica para salvar o serviço
    const serviceData = {
      ...addingService,
      vehicle: selectedVehicle,
      clientId: client.id,
      createdAt: new Date().toISOString(),
    };

    console.log("Novo serviço pendente:", serviceData);

    // Limpar estados e fechar modal
    setAddingService({});
    setIsVehicleFocus(false);
    setPendingServiceModal(false);

    Alert.alert("Sucesso", "Serviço pendente criado com sucesso!");
  };

  const createServiceNote = () => {
    Alert.alert("Nova Nota", "Criar nova nota de serviço para este cliente?", [
      { text: "Cancelar" },
      {
        text: "Confirmar",
        onPress: () => router.push("./serviceBill"),
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <PageHeader
          title="Informações do Cliente"
          containerStyle={{ backgroundColor: Colors.azulClaro }}
          titleStyle={{ color: "white" }}
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
                <MaterialIcons name="edit" size={20} color={Colors.azul} />
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
                <Text style={styles.infoValue}>
                  {formatPhone(client.telefone)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>CEP:</Text>
                <Text style={styles.infoValue}>{formatCEP(client.cep)}</Text>
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

            {vehicles?.length === 0 ? (
              <View style={styles.noVehiclesContainer}>
                <Text style={styles.noVehiclesText}>
                  Nenhum veículo cadastrado para este cliente
                </Text>
              </View>
            ) : (
              vehicles?.map((vehicle, index) => (
                <View key={index} style={styles.vehicleCard}>
                  <View style={styles.vehicleHeader}>
                    <Text style={styles.vehicleName}>
                      {vehicle.veiculo} {vehicle.modelo} ({vehicle.ano})
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleEditVehicle(vehicle, index)}
                    >
                      <MaterialIcons
                        name="edit"
                        size={20}
                        color={Colors.azul}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.vehicleInfo}>
                    <View style={styles.vehicleInfoItem}>
                      <Text style={styles.vehicleInfoLabel}>Cor:</Text>
                      <Text style={styles.vehicleInfoValue}>{vehicle.cor}</Text>
                    </View>
                    <View style={styles.vehicleInfoItem}>
                      <Text style={styles.vehicleInfoLabel}>Placa:</Text>
                      <Text style={styles.vehicleInfoValue}>
                        {vehicle.placa}
                      </Text>
                    </View>
                    <View style={styles.vehicleInfoItem}>
                      <Text style={styles.vehicleInfoLabel}>
                        Quilometragem:
                      </Text>
                      <Text style={styles.vehicleInfoValue}>
                        {vehicle.km} km
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
            {renderAddButton("veiculo")}
          </View>

          {/* Botões de Ação */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={createServicePending}
            >
              <FontAwesome5 name="clipboard-list" size={18} color="#FFF" />
              <Text style={styles.actionButtonText}>Nova Pendência</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.noteButton]}
              onPress={createServiceNote}
            >
              <FontAwesome5 name="file-alt" size={18} color="#FFF" />
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
                  value={formatPhone(editingClient.telefone)}
                  onChangeText={(text) => {
                    // Remove a máscara antes de salvar
                    const cleanPhone = removePhoneMask(text);
                    setEditingClient({
                      ...editingClient,
                      telefone: cleanPhone,
                    });
                  }}
                  keyboardType="phone-pad"
                  maxLength={15} // (11) 91234-5678
                />

                <Text style={styles.inputLabel}>CEP</Text>
                <TextInput
                  style={styles.input}
                  value={formatCEP(editingClient.cep)}
                  onChangeText={(text) => {
                    // Remove a máscara antes de salvar
                    const cleanCEP = removeCEPMask(text);
                    setEditingClient({ ...editingClient, cep: cleanCEP });
                  }}
                  keyboardType="numeric"
                  maxLength={9} // 12345-678
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
                    cor={Colors.vermelho}
                    texto="Cancelar"
                    onPress={() => setEditClientModal(false)}
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
                    onPress={saveClientChanges}
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
                    cor={Colors.vermelho}
                    texto="Cancelar"
                    onPress={() => setVehicleModal(false)}
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
                    onPress={saveVehicleChanges}
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
          {/* Fim Modal para editar informações do veículo */}

          {/* Modal para criar um carro novo para o cliente */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={newVehicleModal}
            onRequestClose={() => setNewVehicleModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Adicionar Novo Veículo</Text>

                <Text style={styles.inputLabel}>Veículo</Text>
                <TextInput
                  style={styles.input}
                  value={addingVehicle.veiculo || ""}
                  onChangeText={(text) =>
                    setAddingService({ ...addingService, veiculo: text })
                  }
                />

                <Text style={styles.inputLabel}>Modelo</Text>
                <TextInput
                  style={styles.input}
                  value={addingService.modelo || ""}
                  onChangeText={(text) =>
                    setAddingService({ ...addingService, modelo: text })
                  }
                />

                <Text style={styles.inputLabel}>Ano</Text>
                <TextInput
                  style={styles.input}
                  value={addingService.ano || ""}
                  onChangeText={(text) =>
                    setAddingService({ ...addingService, ano: text })
                  }
                  keyboardType="numeric"
                />

                <Text style={styles.inputLabel}>Cor</Text>
                <TextInput
                  style={styles.input}
                  value={addingService.cor || ""}
                  onChangeText={(text) =>
                    setAddingService({ ...addingService, cor: text })
                  }
                />

                <Text style={styles.inputLabel}>Quilometragem (KM)</Text>
                <TextInput
                  style={styles.input}
                  value={addingService.km || ""}
                  onChangeText={(text) =>
                    setAddingService({ ...addingService, km: text })
                  }
                  keyboardType="numeric"
                />

                <Text style={styles.inputLabel}>Placa</Text>
                <TextInput
                  style={styles.input}
                  value={addingService.placa || ""}
                  onChangeText={(text) =>
                    setAddingService({
                      ...addingService,
                      placa: text.toUpperCase(),
                    })
                  }
                  maxLength={8}
                />

                <View style={styles.modalButtons}>
                  <Button
                    cor={Colors.vermelho}
                    texto="Cancelar"
                    onPress={cancelAddVehicle}
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
                    texto="Adicionar"
                    onPress={saveNewVehicle}
                  >
                    <MaterialIcons
                      name="add"
                      size={18}
                      color="white"
                      style={{ marginRight: 5 }}
                    />
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
          {/* Fim Modal para criar um carro novo para o cliente */}

          {/* Modal para adicionar um serviço pendente */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={pendingServiceModal}
            onRequestClose={() => setPendingServiceModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Criar Serviço Pendente</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Selecionar Veículo:</Text>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      isVehicleFocus && { borderColor: Colors.azul },
                    ]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    data={getVehicleDropdownData()}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={
                      !isVehicleFocus ? "Selecione um veículo" : "..."
                    }
                    value={addingService.vehicleId}
                    onFocus={() => setIsVehicleFocus(true)}
                    onBlur={() => setIsVehicleFocus(false)}
                    onChange={(item) => {
                      setAddingService({
                        ...addingService,
                        vehicleId: item.value,
                        licensePlate: item.vehicle.placa,
                      });
                      setIsVehicleFocus(false);
                    }}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Placa:</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: "#f5f5f5" }]}
                    value={addingService.licensePlate || ""}
                    placeholder="Placa será preenchida automaticamente"
                    editable={false}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Descrição:</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={addingService.description || ""}
                    onChangeText={(text) =>
                      setAddingService({ ...addingService, description: text })
                    }
                    placeholder="Digite a descrição do serviço"
                    multiline={true}
                    numberOfLines={4}
                  />
                </View>

                <View style={styles.modalButtons}>
                  <Button
                    cor={Colors.vermelho}
                    texto="Cancelar"
                    onPress={cancelAddService}
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
          {/* Fim Modal para adicionar um serviço pendente */}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default clientInfo;

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
    backgroundColor: Colors.cinzaClaro,
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
    color: Colors.grafite,
    fontFamily: "DM-Sans",
    marginBottom: 8,
  },
  addButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.verde,
  },
  editButton: {
    padding: 5,
  },
  infoContainer: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    width: 130,
    fontSize: 15,
    color: Colors.grafite,
    fontWeight: "500",
    fontFamily: "DM-Sans",
  },
  infoValue: {
    fontSize: 15,
    color: Colors.grafite,
    fontFamily: "DM-Sans",
  },
  shopStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.cinzaClaro,
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
    color: Colors.grafite,
    fontWeight: "500",
    fontFamily: "DM-Sans",
  },
  vehicleCard: {
    backgroundColor: "#e9e9e9",
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
    color: Colors.grafite,
    fontFamily: "DM-Sans",
  },
  vehicleInfo: {
    marginLeft: 5,
  },
  vehicleInfoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  vehicleInfoLabel: {
    fontSize: 14,
    color: "black",
    fontWeight: "500",
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
    fontFamily: "DM-Sans",
  },
  inputContainer: {
    marginBottom: 16,
    flexDirection: "column",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    fontFamily: "DM-Sans",
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
    backgroundColor: Colors.azul,
  },
  modalButtonText: {
    fontWeight: "bold",
    color: "#333",
    fontFamily: "DM-Sans",
  },
  // Estilos do dropdown
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "white",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#999",
    padding: 12
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#333",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    padding: 12
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  inputContainer: {
    marginBottom: 15,
  },
});
