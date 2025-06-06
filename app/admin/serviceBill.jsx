// Tela para visualizar as informações da nota de serviço e gerar um PDF dela

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Esse import precisa ser diferente para funcionar corretamente
import { useState } from "react";

// COMPONENTES
import PageHeader from "@/components/PageHeader";
import BillClientContent from "@/components/admin/BillClientContent";
import Button from "@/components/Button";

// ÍCONES
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// CORES
import Colors from "@/constants/Colors";
import BillVehicleContent from "../../components/admin/BillVehicleContent";

const NotaServico = () => {
  // States para definir se a seção está expandida ou não
  const [expandedSections, setExpandedSections] = useState({
    cliente: false,
    veiculo: false,
    produtos: false,
    servicos: false,
  });

  // States para definir se o modal está visível ou não
  const [modalsVisible, setModalsVisible] = useState({
    cliente: false,
    veiculo: false,
    produtos: false,
    servicos: false,
  });

  // Índices para edição/adição em produtos e serviços (-1 para novo)
  const [editingIndex, setEditingIndex] = useState({
    produtos: null,
    servicos: null,
  });

  // MOCKS
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
  });

  // Estados temporários para edição/adição
  const [tempData, setTempData] = useState({});

  // FUNÇÃO PARA EXPANDIR SEÇÃO
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // FUNÇÃO PARA ABRIR MODAL
  const openModal = (section, index = null) => {
    if ((section === "produtos" || section === "servicos") && index !== null) {
      // Editing existing item
      if (section === "produtos") {
        setTempData({ ...dadosNota.produtos[index] });
      } else {
        setTempData({ ...dadosNota.servicos[index] });
      }
      setEditingIndex((prev) => ({ ...prev, [section]: index }));
    } else if (
      (section === "produtos" || section === "servicos") &&
      index === null
    ) {
      // Adding new item
      if (section === "produtos") {
        setTempData({
          id: Date.now(), // Temporary ID
          nome: "",
          quantidade: 0,
          unidade: "",
          valorUnitario: 0,
          valorTotal: 0,
        });
      } else {
        setTempData({
          id: Date.now(), // Temporary ID
          descricao: "",
          valorMaoDeObra: 0,
          tempo: "",
        });
      }
      setEditingIndex((prev) => ({ ...prev, [section]: -1 }));
    } else {
      // Sections cliente, veiculo
      setTempData({ ...dadosNota[section] });
      setEditingIndex((prev) => ({ ...prev, [section]: null }));
    }

    setModalsVisible((prev) => ({
      ...prev,
      [section]: true,
    }));
  };

  // FUNÇÃO PARA FECHAR MODAL
  const closeModal = (section) => {
    setModalsVisible((prev) => ({
      ...prev,
      [section]: false,
    }));
    setTempData({});
    setEditingIndex((prev) => ({ ...prev, [section]: null }));
  };

  // FUNÇÃO PARA SALVAR AS MUDANÇAS
  const saveChanges = (section) => {
    if (section === "produtos") {
      setDadosNota((prev) => {
        const updatedProdutos = [...prev.produtos];
        if (editingIndex.produtos === -1) {
          // ADICIONAR NOVO PRODUTO
          const newProduto = {
            ...tempData,
            quantidade: Number(tempData.quantidade),
            valorUnitario: Number(tempData.valorUnitario),
            valorTotal:
              Number(tempData.valorUnitario) * Number(tempData.quantidade),
          };
          updatedProdutos.push(newProduto);
        } else {
          // EDITANDO
          const index = editingIndex.produtos;
          const updatedProduto = {
            ...tempData,
            quantidade: Number(tempData.quantidade),
            valorUnitario: Number(tempData.valorUnitario),
            valorTotal:
              Number(tempData.valorUnitario) * Number(tempData.quantidade),
          };
          updatedProdutos[index] = updatedProduto;
        }
        return { ...prev, produtos: updatedProdutos };
      });
    } else if (section === "servicos") {
      setDadosNota((prev) => {
        const updatedServicos = [...prev.servicos];
        if (editingIndex.servicos === -1) {
          // Adding new
          const newServico = {
            ...tempData,
            valorMaoDeObra: Number(tempData.valorMaoDeObra),
          };
          updatedServicos.push(newServico);
        } else {
          // Editing
          const index = editingIndex.servicos;
          updatedServicos[index] = {
            ...tempData,
            valorMaoDeObra: Number(tempData.valorMaoDeObra),
          };
        }
        return { ...prev, servicos: updatedServicos };
      });
    } else {
      setDadosNota((prev) => ({
        ...prev,
        [section]: { ...tempData },
      }));
    }

    closeModal(section);
    Alert.alert("Sucesso", "Informações atualizadas com sucesso!");
  };

  // FUNÇÃO PARA DELETAR ITEM
  const deleteItem = (section, index) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este item?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            setDadosNota((prev) => {
              if (section === "produtos") {
                const newProdutos = prev.produtos.filter((_, i) => i !== index);
                return { ...prev, produtos: newProdutos };
              } else if (section === "servicos") {
                const newServicos = prev.servicos.filter((_, i) => i !== index);
                return { ...prev, servicos: newServicos };
              } else {
                return prev;
              }
            });
          },
        },
      ]
    );
  };

  // FUNÇÃO PARA CALCULAR O PREÇO TOTAL DOS SERVIÇOS
  const calcularTotalProdutos = () => {
    return dadosNota.produtos.reduce(
      (total, produto) => total + produto.valorTotal,
      0
    );
  };

  // FUNÇÃO PARA CALCULAR O PREÇO TOTAL DOS SERVIÇOS
  const calcularTotalServicos = () => {
    return dadosNota.servicos.reduce(
      (total, servico) => total + servico.valorMaoDeObra,
      0
    );
  };

  // FUNÇÃO PARA CALCUÇAR O PREÇO TOTAL DE TUDO
  const calcularTotalGeral = () => {
    return calcularTotalProdutos() + calcularTotalServicos();
  };

  // FUNÇÃO PARA GERAR PDF
  const gerarPDF = () => {
    Alert.alert(
      "Gerar PDF",
      "Funcionalidade de geração de PDF será implementada em breve."
    );
  };

  // FUNÇÃO PARA RENDERIZAR CADA SEÇÃO
  const renderSection = (title, sectionKey, content, addButton) => {
    const isExpanded = expandedSections[sectionKey];

    return (
      <View
        style={[
          // Esse estilo serve para arredondar as bordas exteriores dos cards das bordas
          styles.sectionContainer,
          title === "CLIENTE" && {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
          title === "SERVIÇOS" && {
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(sectionKey)}
        >
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={styles.headerIcons}>
            {title === "CLIENTE" || title === "VEÍCULO" ? (
              // os botões de editar vão aparecer apenas nos cards CLIENTE e VEÍCULO
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
              color={Colors.grafite}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.sectionContent}>
            {content}
            {addButton}
          </View>
        )}
      </View>
    );
  };

  // CONTEÚDO DO CLIENTE
  const renderClienteContent = () => <BillClientContent />;

  // CONTEÚDO DO VEÍCULO
  const renderVeiculoContent = () => <BillVehicleContent />;

  // CONTEÚDO DOS PRODUTOS
  const renderProdutosContent = () => (
    <View>
      {dadosNota.produtos.map((produto, index) => (
        <View key={produto.id} style={styles.itemContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.itemNome}>{produto.nome}</Text>
            <View
              style={{ flexDirection: "row", gap: 12, alignItems: "center" }}
            >
              <TouchableOpacity onPress={() => openModal("produtos", index)}>
                <Ionicons name="pencil" size={18} color={Colors.azul} style={{marginRight: 5}}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteItem("produtos", index)}>
                <Ionicons name="trash" size={18} color={Colors.vermelho} />
              </TouchableOpacity>
            </View>
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

  // CONTEÚDO DOS SERVIÇOS
  const renderServicosContent = () => (
    <View>
      {dadosNota.servicos.map((servico, index) => (
        <View key={servico.id} style={styles.itemContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.itemNome}>{servico.descricao}</Text>
            <View
              style={{ flexDirection: "row", gap: 12, alignItems: "center" }}
            >
              <TouchableOpacity onPress={() => openModal("servicos", index)}>
                <Ionicons name="pencil" size={18} color={Colors.azul} style={{marginRight: 2}}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteItem("servicos", index)}>
                <Ionicons name="trash" size={18} color={Colors.vermelho} />
              </TouchableOpacity>
            </View>
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

  // BOTÃO DE ADICIONAR
  const renderAddButton = (section) => (
    <TouchableOpacity
      style={styles.addButton}
      onPress={() => openModal(section, null)}
    >
      <Ionicons name="add-circle-outline" size={24} color={Colors.verde} />
      <Text style={styles.addButtonText}>
        Adicionar {section === "produtos" ? "Produto" : "Serviço"}
      </Text>
    </TouchableOpacity>
  );

  // MODAL DO CLIENTE
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
            <Button
              texto="Cancelar"
              cor={Colors.vermelho}
              onPress={() => closeModal("cliente")}
            >
              <MaterialIcons
                name="cancel"
                size={18}
                color="white"
                style={{ marginRight: 5 }}
              />
            </Button>

            <Button
              texto="Salvar"
              cor={Colors.verde}
              onPress={() => saveChanges("cliente")}
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
  );

  // MODAL DO VEÍCULO
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
            <Button
              texto="Cancelar"
              cor={Colors.vermelho}
              onPress={() => closeModal("veiculo")}
            >
              <MaterialIcons
                name="cancel"
                size={18}
                color="white"
                style={{ marginRight: 5 }}
              />
            </Button>

            <Button
              texto="Salvar"
              cor={Colors.verde}
              onPress={() => saveChanges("veiculo")}
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
  );

  // MODAL DOS PRODUTOS
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
            <Text style={styles.modalTitle}>
              {editingIndex.produtos === -1
                ? "Adicionar Produto"
                : "Editar Produto"}
            </Text>
            <TouchableOpacity onPress={() => closeModal("produtos")}>
              <Ionicons name="close" size={24} color={Colors.grafite} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.modalContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome do Produto</Text>
              <TextInput
                style={styles.input}
                value={tempData.nome || ""}
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, nome: text }))
                }
                placeholder="Nome do produto"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quantidade</Text>
              <TextInput
                style={styles.input}
                value={
                  tempData.quantidade !== undefined
                    ? String(tempData.quantidade)
                    : ""
                }
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, quantidade: text }))
                }
                placeholder="Quantidade"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Unidade</Text>
              <TextInput
                style={styles.input}
                value={tempData.unidade || ""}
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, unidade: text }))
                }
                placeholder="Unidade (ex: litros, unidade, jogo)"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Valor Unitário</Text>
              <TextInput
                style={styles.input}
                value={
                  tempData.valorUnitario !== undefined
                    ? String(tempData.valorUnitario)
                    : ""
                }
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, valorUnitario: text }))
                }
                placeholder="valor unitário"
                keyboardType="numeric"
              />
            </View>
          </ScrollView>
          <View style={styles.modalButtons}>
            <Button
              texto="Cancelar"
              cor={Colors.vermelho}
              onPress={() => closeModal("produtos")}
            >
              <MaterialIcons
                name="cancel"
                size={18}
                color="white"
                style={{ marginRight: 5 }}
              />
            </Button>

            <Button
              texto="Salvar"
              cor={Colors.verde}
              onPress={() => saveChanges("produtos")}
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
  );

  // MODAL DOS SERVIÇOS
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
            <Text style={styles.modalTitle}>
              {editingIndex.servicos === -1
                ? "Adicionar Serviço"
                : "Editar Serviço"}
            </Text>
            <TouchableOpacity onPress={() => closeModal("servicos")}>
              <Ionicons name="close" size={24} color={Colors.grafite} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.modalContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descrição do Serviço</Text>
              <TextInput
                style={styles.input}
                value={tempData.descricao || ""}
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, descricao: text }))
                }
                placeholder="Descrição do serviço"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tempo</Text>
              <TextInput
                style={styles.input}
                value={tempData.tempo || ""}
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, tempo: text }))
                }
                placeholder="Tempo estimado (ex: 1h 30min)"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Valor Mão de Obra</Text>
              <TextInput
                style={styles.input}
                value={
                  tempData.valorMaoDeObra !== undefined
                    ? String(tempData.valorMaoDeObra)
                    : ""
                }
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, valorMaoDeObra: text }))
                }
                placeholder="valor mão de obra"
                keyboardType="numeric"
              />
            </View>
          </ScrollView>
          <View style={styles.modalButtons}>
            <Button
              texto="Cancelar"
              cor={Colors.vermelho}
              onPress={() => closeModal("servicos")}
            >
              <MaterialIcons
                name="cancel"
                size={18}
                color="white"
                style={{ marginRight: 5 }}
              />
            </Button>

            <Button
              texto="Salvar"
              cor={Colors.verde}
              onPress={() => saveChanges("servicos")}
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
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageHeader
        title="Serviços em Pendência"
        containerStyle={{ backgroundColor: Colors.azulClaro }}
        titleStyle={{ color: "#fff" }}
      />
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
          {/* Seções Expansíveis */}
          {renderSection("CLIENTE", "cliente", renderClienteContent())}
          {renderSection("VEÍCULO", "veiculo", renderVeiculoContent())}
          {renderSection(
            "PRODUTOS",
            "produtos",
            renderProdutosContent(),
            renderAddButton("produtos")
          )}
          {renderSection(
            "SERVIÇOS",
            "servicos",
            renderServicosContent(),
            renderAddButton("servicos")
          )}

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
            <Button texto="Gerar PDF" cor={Colors.azul} onPress={gerarPDF}>
              <Ionicons
                name="document-text"
                size={20}
                color="white"
                style={{ marginRight: 5 }}
              />
            </Button>
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
    borderStyle: "dashed",
    borderBottomColor: "#666",
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
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.grafite,
  },
  sectionContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
    justifyContent: "space-between",
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
    backgroundColor: "#e9e9e9",
    padding: 12,
    borderRadius: 10,
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
    borderRadius: 10,
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
    borderRadius: 10,
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
    borderRadius: 10,
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
    backgroundColor: Colors.azul,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 10,
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
  // Estilos dos Modais
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
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
    borderRadius: 10,
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
    borderRadius: 10,
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
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  saveButtonText: {
    fontWeight: "bold",
    fontFamily: "DM-Sans",
    color: "white",
    fontSize: 16,
  },
});
