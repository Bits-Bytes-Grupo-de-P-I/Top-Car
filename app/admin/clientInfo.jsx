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
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";
// import GeneratePdfBtn from "@/components/admin/GeneratePdfBtn";

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
    id: params.id,
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

  const [vehicles, setVehicles] = useState([]);
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
  const [loading, setLoading] = useState(false); // state para definir carregamento de informações

  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJqb2FvQGV4YW1wbGUuY29tIiwiZnVuY2FvIjoiYWRtaW4iLCJpYXQiOjE3NDg0NTQzODR9.3fxamj4FEzv265boICnC3WqcJZLiJ0Kfsmbpg9S9lFs";

  const handleCreateVehicle = async () => {
    try {
      // Validação básica dos campos obrigatórios
      if (
        !addingVehicle.marca?.trim() ||
        !addingVehicle.modelo?.trim() ||
        !addingVehicle.ano?.trim() ||
        !addingVehicle.placa?.trim()
      ) {
        Alert.alert(
          "Campos obrigatórios",
          "Por favor, preencha marca, modelo, ano e placa do veículo."
        );
        return;
      }

      setLoading(true);

      // Preparar os dados do veículo
      const veiculoData = {
        cliente_id: client.id, // ID do cliente atual
        marca: addingVehicle.marca.trim(),
        modelo: addingVehicle.modelo.trim(),
        ano: parseInt(addingVehicle.ano.trim()),
        placa: addingVehicle.placa.trim().toUpperCase(),
        cor: addingVehicle.cor?.trim() || null,
        km: addingVehicle.km ? parseInt(addingVehicle.km.trim()) : null,
        ultima_manutencao: null,
      };

      // Fazer a requisição POST para cadastrar o veículo
      const response = await fetch(
        "https://topcar-back-end.onrender.com/veiculos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(veiculoData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar veículo");
      }

      const veiculoResponse = await response.json();
      console.log("Veículo cadastrado com sucesso:", veiculoResponse);

      // Atualizar a lista de veículos
      await fetchVehicles();

      // Limpar o formulário e fechar modal
      setAddingVehicle({});
      setNewVehicleModal(false);

      // Sucesso
      Alert.alert("Cadastro Realizado", "Veículo cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar veículo:", error);

      let errorMessage =
        "Não foi possível cadastrar o veículo. Por favor, tente novamente.";
      if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar a lista de carros do cliente
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://topcar-back-end.onrender.com/veiculos",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error(`Erro: ${response.status}`);
      const data = await response.json();

      // filtra pelo cliente atual
      const filtered = data.filter(
        (v) => String(v.cliente_id) === String(client.id)
      );
      setVehicles(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // função que faz a navegação passando params
  const handleNewNote = () => {
    router.push({
      pathname: "./serviceBill",
      params: {
        client: JSON.stringify(client),
        vehicles: JSON.stringify(vehicles),
      },
    });
  };

  const handleEditClient = () => {
    setEditingClient({ ...client });
    setEditClientModal(true);
  };

  const handleUpdateClient = async () => {
  try {
    // Validação básica dos campos obrigatórios
    if (!editingClient.nome?.trim()) {
      Alert.alert("Erro", "O nome do cliente é obrigatório.");
      return;
    }

    if (!editingClient.documento?.trim()) {
      Alert.alert("Erro", "O documento (CPF/CNPJ) é obrigatório.");
      return;
    }

    setLoading(true);

    // Preparar os dados do cliente para envio
    const clientData = {
      nome: editingClient.nome.trim(),
      cpf: editingClient.documento.trim(),
      email: editingClient.email?.trim() || "",
      tipo_pessoa: editingClient.tipoPessoa || "fisica",
      telefone: editingClient.telefone || "",
      cep: editingClient.cep || "",
      endereco: editingClient.endereco?.trim() || "",
      numero: editingClient.numero?.trim() || "",
      bairro: editingClient.bairro?.trim() || "",
      cidade: editingClient.cidade?.trim() || "",
      estado: editingClient.estado?.trim() || "",
      funcao: editingClient.funcao?.trim() || "",
    };

    // Fazer a requisição PUT para atualizar o cliente
    const response = await fetch(
      `https://topcar-back-end.onrender.com/clientes/${client.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(clientData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao atualizar cliente");
    }

    const updatedClient = await response.json();
    console.log("Cliente atualizado com sucesso:", updatedClient);

    // Atualizar o estado local com os dados atualizados
    setClient({
      ...client,
      nome: clientData.nome,
      documento: clientData.cpf,
      email: clientData.email,
      tipoPessoa: clientData.tipo_pessoa,
      telefone: clientData.telefone,
      cep: clientData.cep,
      endereco: clientData.endereco,
      numero: clientData.numero,
      bairro: clientData.bairro,
      cidade: clientData.cidade,
      estado: clientData.estado,
      funcao: clientData.funcao,
    });

    // Fechar modal e mostrar sucesso
    setEditClientModal(false);
    Alert.alert("Sucesso", "Informações do cliente atualizadas com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);

    let errorMessage =
      "Não foi possível atualizar as informações do cliente. Por favor, tente novamente.";
    if (error.message) {
      errorMessage = error.message;
    }

    Alert.alert("Erro", errorMessage);
  } finally {
    setLoading(false);
  }
};

  const handleEditVehicle = (vehicle, index) => {
    setEditingVehicle({ ...vehicle });
    setEditingVehicleIndex(index);
    setVehicleModal(true);
  };

  const saveVehicleChanges = async () => {
    try {
      // Validação básica dos campos obrigatórios
      if (
        !editingVehicle.marca ||
        !editingVehicle.modelo ||
        !editingVehicle.placa
      ) {
        Alert.alert(
          "Erro",
          "Por favor, preencha todos os campos obrigatórios (Marca, Modelo e Placa)"
        );
        return;
      }

      // Preparar os dados para envio
      const vehicleData = {
        cliente_id: 5,
        marca: editingVehicle.marca.trim(),
        modelo: editingVehicle.modelo.trim(),
        ano: editingVehicle.ano ? parseInt(editingVehicle.ano) : null,
        cor: editingVehicle.cor ? editingVehicle.cor.trim() : "",
        km: editingVehicle.km ? parseInt(editingVehicle.km) : null,
        ultima_manutencao: "2026-01-01",
        placa: editingVehicle.placa.trim().toUpperCase(),
      };

      // Fazer a requisição PUT para atualizar o veículo
      const response = await fetch(
        `https://topcar-back-end.onrender.com/veiculos/${editingVehicle.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(vehicleData),
        }
      );

      if (response.ok) {
        await fetchVehicles();

        setVehicleModal(false);
        Alert.alert(
          "Sucesso",
          "Informações do veículo atualizadas com sucesso!"
        );
      } else {
        const errorData = await response.json();
        Alert.alert("Erro", errorData.message || "Erro ao atualizar o veículo");
      }
    } catch (error) {
      console.error("Erro ao salvar alterações do veículo:", error);
      Alert.alert("Erro", "Erro de conexão. Tente novamente.");
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);

              const response = await fetch(
                `https://topcar-back-end.onrender.com/veiculos/${vehicleId}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                }
              );

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao excluir veículo");
              }

              await fetchVehicles();
              Alert.alert("Sucesso", "Veículo excluído com sucesso!");
            } catch (error) {
              console.error("Erro ao excluir veículo:", error);
              Alert.alert(
                "Erro",
                error.message || "Não foi possível excluir o veículo."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
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
      label: `${vehicle.marca} ${vehicle.modelo} (${vehicle.ano}) - ${vehicle.placa}`,
      value: vehicle.id,
      vehicle: vehicle,
    }));
  };

  // Função para cancelar adição (limpa os dados e fecha modal)
  const cancelAddVehicle = () => {
    setAddingVehicle({});
    setNewVehicleModal(false);
  };

  // BOTÃO DE ADICIONAR
  const renderAddButton = (section) => (
    <TouchableOpacity style={styles.addButton} onPress={openAddVehicleModal}>
      <Ionicons name="add-circle-outline" size={24} color={Colors.verde} />
      <Text style={styles.addButtonText}>Adicionar Veículo</Text>
    </TouchableOpacity>
  );

  // Modal para adicionar um serviço pendente vinculado ao cliente
  const handleCreatePendingService = async () => {
    try {
      // Validação básica dos campos obrigatórios
      if (!addingService.veiculo_id || !addingService.descricao?.trim()) {
        Alert.alert(
          "Campos obrigatórios",
          "Por favor, selecione um veículo e descreva o serviço."
        );
        return;
      }

      // Validação adicional para garantir que client existe
      if (!client?.id) {
        Alert.alert(
          "Erro",
          "Informações do cliente não encontradas. Tente novamente."
        );
        return;
      }

      setLoading(true);

      // Preparar os dados do serviço
      const servicoData = {
        cliente_id: parseInt(client.id), // Converter para número
        veiculo_id: parseInt(addingService.veiculo_id),
        descricao: addingService.descricao.trim(),
        data_registro: "2026-01-01",
      };

      // Fazer a requisição POST para criar o serviço pendente
      const response = await fetch(
        "https://topcar-back-end.onrender.com/pendencias",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(servicoData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(servicoData);
        throw new Error(errorData.message || "Erro ao criar serviço pendente");
      }

      const servicoResponse = await response.json();
      console.log("Serviço pendente criado com sucesso:", servicoResponse);

      // Limpar o formulário e fechar modal
      setAddingService({});
      setPendingServiceModal(false);

      // Sucesso
      Alert.alert("Serviço Criado", "Serviço pendente registrado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar serviço pendente:", error);

      let errorMessage =
        "Não foi possível criar o serviço pendente. Por favor, tente novamente.";
      if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Função para cancelar a criação do serviço
  const cancelAddService = () => {
    setAddingService({});
    setIsVehicleFocus(false);
    setPendingServiceModal(false);
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
                      {vehicle.marca} {vehicle.modelo} ({vehicle.ano})
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        onPress={() =>
                          handleDeleteVehicle(
                            vehicle.id,
                            `${vehicle.marca} ${vehicle.modelo}`
                          )
                        }
                        style={{ marginRight: 5 }}
                      >
                        <Ionicons
                          name="trash"
                          size={18}
                          color={Colors.vermelho}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        />
                      </TouchableOpacity>
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
              onPress={() => setPendingServiceModal(true)}
            >
              <FontAwesome5 name="clipboard-list" size={18} color="#FFF" />
              <Text style={styles.actionButtonText}>Nova Pendência</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.noteButton]}
              onPress={handleNewNote}
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
                  maxLength={8} // 12345678
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
                    onPress={handleUpdateClient}
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
                  value={editingVehicle.marca}
                  onChangeText={(text) =>
                    setEditingVehicle({ ...editingVehicle, marca: text })
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
                  value={
                    editingVehicle.ano !== undefined
                      ? String(editingVehicle.ano)
                      : ""
                  }
                  onChangeText={(number) =>
                    setEditingVehicle({ ...editingVehicle, ano: number })
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
                <Text style={styles.inputLabel}>Marca</Text>
                <TextInput
                  style={styles.input}
                  value={addingVehicle.marca || ""}
                  onChangeText={(text) =>
                    setAddingVehicle({ ...addingVehicle, marca: text })
                  }
                />
                <Text style={styles.inputLabel}>Modelo</Text>
                <TextInput
                  style={styles.input}
                  value={addingVehicle.modelo || ""}
                  onChangeText={(text) =>
                    setAddingVehicle({ ...addingVehicle, modelo: text })
                  }
                />
                <Text style={styles.inputLabel}>Ano</Text>
                <TextInput
                  style={styles.input}
                  value={addingVehicle.ano || ""}
                  onChangeText={(text) =>
                    setAddingVehicle({ ...addingVehicle, ano: text })
                  }
                  keyboardType="numeric"
                />
                <Text style={styles.inputLabel}>Cor</Text>
                <TextInput
                  style={styles.input}
                  value={addingVehicle.cor || ""}
                  onChangeText={(text) =>
                    setAddingVehicle({ ...addingVehicle, cor: text })
                  }
                />
                <Text style={styles.inputLabel}>Quilometragem (KM)</Text>
                <TextInput
                  style={styles.input}
                  value={addingVehicle.km || ""}
                  onChangeText={(text) =>
                    setAddingVehicle({ ...addingVehicle, km: text })
                  }
                  keyboardType="numeric"
                />
                <Text style={styles.inputLabel}>Placa</Text>
                <TextInput
                  style={styles.input}
                  value={addingVehicle.placa || ""}
                  onChangeText={(text) =>
                    setAddingVehicle({
                      ...addingVehicle,
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
                    onPress={handleCreateVehicle}
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
                    value={addingService.veiculo_id}
                    onFocus={() => setIsVehicleFocus(true)}
                    onBlur={() => setIsVehicleFocus(false)}
                    onChange={(item) => {
                      setAddingService({
                        ...addingService,
                        veiculo_id: item.value,
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
                    value={addingService.descricao || ""}
                    onChangeText={(text) =>
                      setAddingService({ ...addingService, descricao: text })
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
                    onPress={handleCreatePendingService}
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
    padding: 12,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#333",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    padding: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  inputContainer: {
    marginBottom: 15,
  },
});
