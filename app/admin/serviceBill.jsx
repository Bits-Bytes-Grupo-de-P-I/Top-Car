import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import Colors from "@/constants/Colors";

const NotaServico = () => {
  const [expandedSections, setExpandedSections] = useState({
    cliente: false,
    veiculo: false,
    produtos: false,
    servicos: false,
  });

  const [modalsVisible, setModalsVisible] = useState({
    cliente: false,
    veiculo: false,
    produtos: false,
    servicos: false,
  });

  // Dados mockados baseados nos arquivos fornecidos
  const [dadosNota, setDadosNota] = useState({
    cliente: {
      nome: "João Silva",
      tipoPessoa: "física",
      documento: "123.456.789-00",
      telefone: "(11) 98765-4321",
      endereco: "Rua das Flores, 123 - Centro",
      cidade: "São Paulo - SP",
      cep: "12345-678",
    },
    veiculo: {
      marca: "Renault",
      modelo: "Kwid Zen",
      ano: "2022",
      cor: "Branco",
      placa: "ABC1D23",
      km: "15.000 km",
    },
    produtos: [
      {
        id: 1,
        nome: "Óleo Motor 5W30",
        quantidade: 4,
        unidade: "litros",
        valorUnitario: 25.5,
        valorTotal: 102.0,
      },
      {
        id: 2,
        nome: "Filtro de Óleo",
        quantidade: 1,
        unidade: "unidade",
        valorUnitario: 35.0,
        valorTotal: 35.0,
      },
      {
        id: 3,
        nome: "Pastilhas de Freio Dianteira",
        quantidade: 1,
        unidade: "jogo",
        valorUnitario: 120.0,
        valorTotal: 120.0,
      },
    ],
    servicos: [
      {
        id: 1,
        descricao: "Troca de óleo e filtro",
        valorMaoDeObra: 80.0,
        tempo: "1h 30min",
      },
      {
        id: 2,
        descricao: "Substituição de pastilhas de freio",
        valorMaoDeObra: 150.0,
        tempo: "2h 00min",
      },
    ],
    dataServico: "23/05/2025",
    numeroNota: "NS-2025-001234",
  });

  // Estados temporários para edição
  const [tempData, setTempData] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const openModal = (section) => {
    // Copia os dados atuais para edição temporária
    setTempData({ ...dadosNota[section] });
    setModalsVisible((prev) => ({
      ...prev,
      [section]: true,
    }));
  };

  const closeModal = (section) => {
    setModalsVisible((prev) => ({
      ...prev,
      [section]: false,
    }));
    setTempData({});
  };

  const saveChanges = (section) => {
    setDadosNota((prev) => ({
      ...prev,
      [section]: { ...tempData },
    }));
    closeModal(section);
    Alert.alert("Sucesso", "Informações atualizadas com sucesso!");
  };

  const calcularTotalProdutos = () => {
    return dadosNota.produtos.reduce(
      (total, produto) => total + produto.valorTotal,
      0
    );
  };

  const calcularTotalServicos = () => {
    return dadosNota.servicos.reduce(
      (total, servico) => total + servico.valorMaoDeObra,
      0
    );
  };

  const calcularTotalGeral = () => {
    return calcularTotalProdutos() + calcularTotalServicos();
  };

  const gerarPDF = () => {
    Alert.alert(
      "Gerar PDF",
      "Funcionalidade de geração de PDF será implementada em breve."
    );
  };

  const renderSection = (title, sectionKey, content) => { // Parâmetros da função
    const isExpanded = expandedSections[sectionKey];

    return (
      <View style={styles.sectionContainer}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(sectionKey)}
        >
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={styles.headerIcons}>
            {title === "CLIENTE" || title === "VEÍCULO" ? (
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => openModal(sectionKey)}
              >
                <Ionicons name="pencil" size={20} color={Colors.azul} />
              </TouchableOpacity>
            ) : null}
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={24}
              color={Colors.azul}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && <View style={styles.sectionContent}>{content}</View>}
      </View>
    );
  };

  const renderClienteContent = () => (
    <View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>{dadosNota.cliente.nome}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Documento:</Text>
        <Text style={styles.value}>{dadosNota.cliente.documento}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Telefone:</Text>
        <Text style={styles.value}>{dadosNota.cliente.telefone}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Endereço:</Text>
        <Text style={styles.value}>{dadosNota.cliente.endereco}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Cidade:</Text>
        <Text style={styles.value}>{dadosNota.cliente.cidade}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>CEP:</Text>
        <Text style={styles.value}>{dadosNota.cliente.cep}</Text>
      </View>
    </View>
  );

  const renderVeiculoContent = () => (
    <View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Marca/Modelo:</Text>
        <Text style={styles.value}>
          {dadosNota.veiculo.marca} {dadosNota.veiculo.modelo}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Ano:</Text>
        <Text style={styles.value}>{dadosNota.veiculo.ano}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Cor:</Text>
        <Text style={styles.value}>{dadosNota.veiculo.cor}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Placa:</Text>
        <Text style={styles.value}>{dadosNota.veiculo.placa}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Quilometragem:</Text>
        <Text style={styles.value}>{dadosNota.veiculo.km}</Text>
      </View>
    </View>
  );

  const renderProdutosContent = () => (
    <View>
      {dadosNota.produtos.map((produto) => (
        <View key={produto.id} style={styles.itemContainer}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.itemNome}>{produto.nome}</Text>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="pencil" size={15} color={Colors.azul} />
            </TouchableOpacity>
          </View>
          <View style={styles.itemDetails}>
            <Text style={styles.itemInfo}>
              Qtd: {produto.quantidade} {produto.unidade}
            </Text>
            <Text style={styles.itemInfo}>
              Unit: R$ {produto.valorUnitario.toFixed(2)}
            </Text>
            <Text style={styles.itemTotal}>
              Total: R$ {produto.valorTotal.toFixed(2)}
            </Text>
          </View>
        </View>
      ))}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total Produtos: R$ {calcularTotalProdutos().toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const renderServicosContent = () => (
    <View>
      {dadosNota.servicos.map((servico) => (
        <View key={servico.id} style={styles.itemContainer}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.itemNome}>{servico.descricao}</Text>
            <TouchableOpacity onPress={() => {openModal()}}>
              <Ionicons name="pencil" size={15} color={Colors.azul} />
            </TouchableOpacity>
          </View>
          <View style={styles.itemDetails}>
            <Text style={styles.itemInfo}>Tempo: {servico.tempo}</Text>
            <Text style={styles.itemTotal}>
              Mão de obra: R$ {servico.valorMaoDeObra.toFixed(2)}
            </Text>
          </View>
        </View>
      ))}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total Serviços: R$ {calcularTotalServicos().toFixed(2)}
        </Text>
      </View>
    </View>
  );

  // Modais de edição
  const renderClienteModal = () => (
    <Modal
      visible={modalsVisible.cliente}
      transparent={true}
      animationType="slide"
      onRequestClose={() => closeModal("cliente")}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Cliente</Text>
            <TouchableOpacity onPress={() => closeModal("cliente")}>
              <Ionicons name="close" size={24} color={Colors.grafite} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput
                style={styles.input}
                value={tempData.nome}
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, nome: text }))
                }
                placeholder="Nome do cliente"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Documento</Text>
              <TextInput
                style={styles.input}
                value={tempData.documento}
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, documento: text }))
                }
                placeholder="CPF/CNPJ"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefone</Text>
              <TextInput
                style={styles.input}
                value={tempData.telefone}
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, telefone: text }))
                }
                placeholder="Telefone"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Endereço</Text>
              <TextInput
                style={styles.input}
                value={tempData.endereco}
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, endereco: text }))
                }
                placeholder="Endereço completo"
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cidade</Text>
              <TextInput
                style={styles.input}
                value={tempData.cidade}
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, cidade: text }))
                }
                placeholder="Cidade - UF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CEP</Text>
              <TextInput
                style={styles.input}
                value={tempData.cep}
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, cep: text }))
                }
                placeholder="CEP"
              />
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => closeModal("cliente")}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => saveChanges("cliente")}
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderVeiculoModal = () => (
    <Modal
      visible={modalsVisible.veiculo}
      transparent={true}
      animationType="slide"
      onRequestClose={() => closeModal("veiculo")}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Veículo</Text>
            <TouchableOpacity onPress={() => closeModal("veiculo")}>
              <Ionicons name="close" size={24} color={Colors.grafite} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Marca</Text>
              <TextInput
                style={styles.input}
                value={tempData.marca}
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, marca: text }))
                }
                placeholder="Marca do veículo"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Modelo</Text>
              <TextInput
                style={styles.input}
                value={tempData.modelo}
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, modelo: text }))
                }
                placeholder="Modelo do veículo"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ano</Text>
              <TextInput
                style={styles.input}
                value={tempData.ano}
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, ano: text }))
                }
                placeholder="Ano"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cor</Text>
              <TextInput
                style={styles.input}
                value={tempData.cor}
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, cor: text }))
                }
                placeholder="Cor do veículo"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Placa</Text>
              <TextInput
                style={styles.input}
                value={tempData.placa}
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, placa: text }))
                }
                placeholder="Placa"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quilometragem</Text>
              <TextInput
                style={styles.input}
                value={tempData.km}
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, km: text }))
                }
                placeholder="Quilometragem atual"
              />
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => closeModal("veiculo")}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => saveChanges("veiculo")}
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderProdutosModal = () => (
    <Modal
      visible={modalsVisible.produtos}
      transparent={true}
      animationType="slide"
      onRequestClose={() => closeModal("produtos")}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Produtos</Text>
            <TouchableOpacity onPress={() => closeModal("produtos")}>
              <Ionicons name="close" size={24} color={Colors.grafite} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalNote}>
              Funcionalidade de edição de produtos será implementada em breve.
              {"\n\n"}Por enquanto, os produtos podem ser gerenciados através do
              sistema principal.
            </Text>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => closeModal("produtos")}
            >
              <Text style={styles.cancelButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderServicosModal = () => (
    <Modal
      visible={modalsVisible.servicos}
      transparent={true}
      animationType="slide"
      onRequestClose={() => closeModal("servicos")}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Serviços</Text>
            <TouchableOpacity onPress={() => closeModal("servicos")}>
              <Ionicons name="close" size={24} color={Colors.grafite} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalNote}>
              Funcionalidade de edição de serviços será implementada em breve.
              {"\n\n"}Por enquanto, os serviços podem ser gerenciados através do
              sistema principal.
            </Text>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => closeModal("servicos")}
            >
              <Text style={styles.cancelButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          style={styles.container}
        >
          {/* Header da Nota */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>NOTA DE SERVIÇO</Text>
            <Text style={styles.numeroNota}>Nº {dadosNota.numeroNota}</Text>
            <Text style={styles.dataServico}>
              Data: {dadosNota.dataServico}
            </Text>
          </View>

          {/* Seções Expansíveis */}
          {renderSection("CLIENTE", "cliente", renderClienteContent())}
          {renderSection("VEÍCULO", "veiculo", renderVeiculoContent())}
          {renderSection("PRODUTOS", "produtos", renderProdutosContent())}
          {renderSection("SERVIÇOS", "servicos", renderServicosContent())}

          {/* Total Geral */}
          <View style={styles.totalGeralContainer}>
            <Text style={styles.totalGeralText}>
              TOTAL GERAL: R$ {calcularTotalGeral().toFixed(2)}
            </Text>
          </View>

          {/* Assinatura da Oficina */}
          <View style={styles.assinaturaContainer}>
            <Text style={styles.assinaturaTitle}>TOP CAR</Text>
            <Text style={styles.assinaturaSubtitle}>Oficina Mecânica</Text>
            <View style={styles.linhaAssinatura} />
            <Text style={styles.assinaturaLabel}>Responsável Técnico</Text>
          </View>

          {/* Botões */}
          <View style={styles.botoesContainer}>
            <TouchableOpacity style={styles.botaoPrimario} onPress={gerarPDF}>
              <Ionicons name="document-text" size={20} color="white" />
              <Text style={styles.textoBotaoPrimario}>Gerar PDF</Text>
            </TouchableOpacity>
          </View>

          {/* Modais */}
          {renderClienteModal()}
          {renderVeiculoModal()}
          {renderProdutosModal()}
          {renderServicosModal()}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default NotaServico;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.grafite,
    marginBottom: 8,
  },
  numeroNota: {
    fontSize: 16,
    color: Colors.grafite,
    marginBottom: 4,
  },
  dataServico: {
    fontSize: 16,
    color: Colors.grafite,
  },
  sectionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.aluminio,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  editIcon: {
    padding: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.grafite,
  },
  sectionContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.grafite,
    width: 100,
    marginRight: 12,
  },
  value: {
    fontSize: 14,
    color: Colors.grafite,
    flex: 1,
  },
  itemContainer: {
    backgroundColor: Colors.cinzaClaro,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.grafite,
    marginBottom: 6,
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  itemInfo: {
    fontSize: 14,
    color: Colors.grafite,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.grafite,
  },
  totalContainer: {
    backgroundColor: Colors.azulClaro,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "right",
  },
  totalGeralContainer: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    padding: 20,
    borderRadius: 12,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: Colors.verde,
  },
  totalGeralText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.verde,
    textAlign: "center",
  },
  assinaturaContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 24,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  assinaturaTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.grafite,
    marginBottom: 4,
  },
  assinaturaSubtitle: {
    fontSize: 16,
    color: Colors.grafite,
    marginBottom: 24,
  },
  linhaAssinatura: {
    width: 200,
    height: 1,
    backgroundColor: Colors.grafite,
    marginBottom: 8,
  },
  assinaturaLabel: {
    fontSize: 14,
    color: Colors.grafite,
  },
  botoesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
  },
  botaoPrimario: {
    backgroundColor: Colors.verde,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textoBotaoPrimario: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  // Estilos dos Modais
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.aluminio,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.grafite,
  },
  modalContent: {
    padding: 20,
    maxHeight: 400,
  },
  modalNote: {
    fontSize: 16,
    color: Colors.grafite,
    textAlign: "center",
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.grafite,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.aluminio,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.cinzaClaro,
    color: Colors.grafite,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.aluminio,
  },
  cancelButton: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: Colors.vermelho,
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.vermelho,
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: Colors.verde,
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  saveButtonText: {
    fontWeight: 'bold',
    fontFamily: 'DM-Sans',
    color: 'white',
    fontSize: 16,
  }
});
