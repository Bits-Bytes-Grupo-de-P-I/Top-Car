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
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";

// COMPONENTES
import PageHeader from "@/components/PageHeader";
import BillVehicleDropdown from "@/components/admin/BillVehicleDropdown";
import BillClientContent from "@/components/admin/BillClientContent";
import Button from "@/components/Button";
import GeneratePdfBtn from "@/components/admin/GeneratePdfBtn";

// ÍCONES
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// CORES
import Colors from "@/constants/Colors";

const NotaServico = () => {
  // Token de autenticação
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJqb2FvQGV4YW1wbGUuY29tIiwiZnVuY2FvIjoiYWRtaW4iLCJpYXQiOjE3NDg0NTQzODR9.3fxamj4FEzv265boICnC3WqcJZLiJ0Kfsmbpg9S9lFs";

  // URLs da API
  const API_BASE_URL = "https://topcar-back-end.onrender.com";
  const PRODUTOS_URL = `${API_BASE_URL}/produtos`;
  const SERVICOS_URL = `${API_BASE_URL}/servicos`;

  // Recupera os parametros passados na tela anterior
  const params = useLocalSearchParams();
  const clientParam = params.client ? JSON.parse(params.client) : null;
  const vehiclesParam = params.vehicles ? JSON.parse(params.vehicles) : [];

const prepararDadosParaPDF = () => {
  // Transformar produtos para o formato esperado pelo PDF
  const produtosFormatados = dadosNota.produtos.map((produto, index) => ({
    codigo: produto.id || `P${index + 1}`,
    referencia: produto.referencia || '-',
    quantidade: produto.quantidade || 0,
    unidade: produto.unidade || 'UN',
    descricao: produto.nome || 'Produto sem nome',
    valorUnitario: Number(produto.valorunitario || 0),
    valorTotal: produto.quantidade * Number(produto.valorunitario || 0)
  }));

  // Transformar serviços para o formato esperado pelo PDF
  const servicosFormatados = dadosNota.servicos.map((servico, index) => ({
    codigo: servico.id || `S${index + 1}`,
    quantidade: 1, // Serviços geralmente têm quantidade 1
    descricao: servico.descricao || 'Serviço sem descrição',
    valorUnitario: Number(servico.valor_mao_de_obra || 0),
    valorTotal: Number(servico.valor_mao_de_obra || 0)
  }));

  // Calcular totais
  const totalProdutos = calcularTotalProdutos();
  const totalServicos = calcularTotalServicos();
  const totalGeral = calcularTotalGeral();

  // Gerar número da OS (você pode implementar sua própria lógica)
  const numeroOS = `OS-${Date.now().toString().slice(-6)}`;

  // Retornar dados no formato esperado pelo PDF
  return {
    cliente: dadosNota.cliente,
    veiculo: dadosNota.veiculo || {},
    produtos: produtosFormatados,
    servicos: servicosFormatados,
    numeroOS: numeroOS,
    totalProdutos: totalProdutos,
    totalServicos: totalServicos,
    totalGeral: totalGeral,
    profissionalResponsavel: "João Silva", // Substitua pelo responsável real
    empresaNome: "TOP CAR",
    empresaCNPJ: "12.345.678/0001-90",
    empresaEndereco: "Rua das Oficinas, 123 - Centro",
    empresaTelefone: "(11) 99999-9999",
    empresaEmail: "contato@topcar.com.br"
  };
};

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

  const [dadosNota, setDadosNota] = useState({
    cliente: clientParam || {},
    veiculo: vehiclesParam[0] || null,
    produtos: [],
    servicos: [],
  });

  // Estados temporários para edição/adição
  const [tempData, setTempData] = useState({});

  // Estado para loading
  const [loading, setLoading] = useState(false);

  // FUNÇÃO makeRequest MELHORADA PARA DEBUG
  const makeRequest = async (url, method = "GET", body = null) => {
    console.log("Fazendo requisição:", { url, method, body });

    const config = {
      method,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    // Só adicionar Content-Type se houver body
    if (body) {
      config.headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      console.log("Status da resposta:", response.status);
      console.log("Headers da resposta:", response.headers);

      if (!response.ok) {
        // Tentar capturar mais detalhes do erro
        let errorData;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
        } else {
          // Se não for JSON, capturar como texto
          const errorText = await response.text();
          errorData = { error: errorText, status: response.status };
        }

        console.error("Erro na resposta:", errorData);

        throw new Error(
          errorData.error ||
            errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // Verificar se há conteúdo na resposta
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      } else {
        // Para requisições DELETE que podem retornar 204 No Content
        return {};
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  };

  // Carregar produtos e serviços do backend ao inicializar
  useEffect(() => {
    loadProdutosEServicos();
  }, []);

  const testarBotaoPDF = () => {
    console.log("🔍 DADOS ATUAIS:", dadosNota);
    console.log("🔍 CLIENTE:", dadosNota.cliente);
    console.log("🔍 VEÍCULO:", dadosNota.veiculo);
    console.log("🔍 PRODUTOS:", dadosNota.produtos);
    console.log("🔍 SERVIÇOS:", dadosNota.servicos);

    const dadosFormatados = prepararDadosParaPDF();
    console.log("🔍 DADOS FORMATADOS:", dadosFormatados);

    Alert.alert(
      "Debug PDF",
      `Cliente: ${dadosNota.cliente?.nome || "Não definido"}\n` +
        `Produtos: ${dadosNota.produtos?.length || 0}\n` +
        `Serviços: ${dadosNota.servicos?.length || 0}\n` +
        `Total: R$ ${calcularTotalGeral().toFixed(2)}`
    );
  };

  const loadProdutosEServicos = async () => {
    setLoading(true);
    try {
      const [produtosResponse, servicosResponse] = await Promise.all([
        makeRequest(PRODUTOS_URL),
        makeRequest(SERVICOS_URL),
      ]);

      setDadosNota((prev) => ({
        ...prev,
        produtos: produtosResponse || [],
        servicos: servicosResponse || [],
      }));
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Erro ao carregar produtos e serviços");
    } finally {
      setLoading(false);
    }
  };

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
          nome: "",
          quantidade: 0,
          unidade: "",
          valorunitario: 0,
        });
      } else {
        setTempData({
          descricao: "",
          valor_mao_de_obra: 0,
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
  const saveChanges = async (section) => {
    setLoading(true);

    try {
      if (section === "produtos") {
        if (editingIndex.produtos === -1) {
          // ADICIONAR NOVO PRODUTO
          const novoProduto = {
            nome: tempData.nome,
            quantidade: Number(tempData.quantidade),
            unidade: tempData.unidade,
            valorunitario: Number(tempData.valorunitario),
            valorUnitario: Number(tempData.valorunitario),
          };

          await makeRequest(PRODUTOS_URL, "POST", novoProduto);
          Alert.alert("Sucesso", "Produto adicionado com sucesso!");
        } else {
          // EDITAR PRODUTO EXISTENTE
          const produtoAtualizado = {
            nome: tempData.nome,
            quantidade: Number(tempData.quantidade),
            unidade: tempData.unidade,
            valorunitario: Number(tempData.valorunitario),
            valorUnitario: Number(tempData.valorunitario),
          };

          const produtoId = dadosNota.produtos[editingIndex.produtos].id;
          await makeRequest(
            `${PRODUTOS_URL}/${produtoId}`,
            "PUT",
            produtoAtualizado
          );
          Alert.alert("Sucesso", "Produto atualizado com sucesso!");
        }

        // Recarregar lista de produtos
        await loadProdutosEServicos();
      } else if (section === "servicos") {
        if (editingIndex.servicos === -1) {
          // ADICIONAR NOVO SERVIÇO
          const novoServico = {
            descricao: tempData.descricao,
            valor_mao_de_obra: Number(tempData.valor_mao_de_obra),
          };

          await makeRequest(SERVICOS_URL, "POST", novoServico);
          Alert.alert("Sucesso", "Serviço adicionado com sucesso!");
        } else {
          // EDITAR SERVIÇO EXISTENTE
          const servicoAtualizado = {
            descricao: tempData.descricao,
            valor_mao_de_obra: Number(tempData.valor_mao_de_obra),
          };

          const servicoId = dadosNota.servicos[editingIndex.servicos].id;
          await makeRequest(
            `${SERVICOS_URL}/${servicoId}`,
            "PUT",
            servicoAtualizado
          );
          Alert.alert("Sucesso", "Serviço atualizado com sucesso!");
        }

        // Recarregar lista de serviços
        await loadProdutosEServicos();
      } else {
        // Para cliente e veículo (mantém local)
        setDadosNota((prev) => ({
          ...prev,
          [section]: { ...tempData },
        }));
        Alert.alert("Sucesso", "Informações atualizadas com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", `Erro ao salvar: ${error.message}`);
    } finally {
      setLoading(false);
    }

    closeModal(section);
  };

  // FUNÇÃO PARA DELETAR ITEM - VERSÃO CORRIGIDA COM DEBUG
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
          onPress: async () => {
            setLoading(true);
            try {
              let itemId;
              let deleteUrl;

              if (section === "produtos") {
                // Verificar se o produto existe e tem ID
                const produto = dadosNota.produtos[index];
                if (!produto) {
                  throw new Error(
                    "Produto não encontrado no índice especificado"
                  );
                }

                itemId = produto.id;
                if (!itemId) {
                  throw new Error("ID do produto não encontrado");
                }

                deleteUrl = `${PRODUTOS_URL}/${itemId}`;
                console.log("Deletando produto:", { index, itemId, produto });
              } else if (section === "servicos") {
                // Verificar se o serviço existe e tem ID
                const servico = dadosNota.servicos[index];
                if (!servico) {
                  throw new Error(
                    "Serviço não encontrado no índice especificado"
                  );
                }

                itemId = servico.id;
                if (!itemId) {
                  throw new Error("ID do serviço não encontrado");
                }

                deleteUrl = `${SERVICOS_URL}/${itemId}`;
                console.log("Deletando serviço:", { index, itemId, servico });
              }

              // Fazer a requisição DELETE
              console.log("URL da requisição DELETE:", deleteUrl);
              const response = await makeRequest(deleteUrl, "DELETE");
              console.log("Resposta da exclusão:", response);

              if (section === "produtos") {
                Alert.alert("Sucesso", "Produto removido com sucesso!");
              } else {
                Alert.alert("Sucesso", "Serviço removido com sucesso!");
              }

              // Recarregar lista
              await loadProdutosEServicos();
            } catch (error) {
              console.error("Erro detalhado ao deletar:", {
                message: error.message,
                section,
                index,
                item:
                  section === "produtos"
                    ? dadosNota.produtos[index]
                    : dadosNota.servicos[index],
              });
              Alert.alert("Erro", `Erro ao excluir: ${error.message}`);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // FUNÇÃO PARA CALCULAR O PREÇO TOTAL DOS PRODUTOS
  const calcularTotalProdutos = () => {
    return dadosNota.produtos.reduce((total, produto) => {
      // converte valorUnitario (string ou número) para Number e usa 0 como fallback
      const valorUnit = Number(produto.valorunitario ?? 0);
      return total + produto.quantidade * valorUnit;
    }, 0);
  };

  // FUNÇÃO PARA CALCULAR O PREÇO TOTAL DOS SERVIÇOS
  const calcularTotalServicos = () => {
    return dadosNota.servicos.reduce((total, servico) => {
      // converte valor_mao_de_obra para Number e usa 0 como fallback
      const valorMao = Number(servico.valor_mao_de_obra ?? 0);
      return total + valorMao;
    }, 0);
  };

  // FUNÇÃO PARA CALCULAR O PREÇO TOTAL DE TUDO
  const calcularTotalGeral = () => {
    return calcularTotalProdutos() + calcularTotalServicos();
  };

  // FUNÇÃO PARA RENDERIZAR CADA SEÇÃO
  const renderSection = (title, sectionKey, content, addButton) => {
    const isExpanded = expandedSections[sectionKey];

    return (
      <View
        style={[
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
  const renderClienteContent = () => (
    <BillClientContent data={dadosNota.cliente} />
  );

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
              <TouchableOpacity onPress={() => deleteItem("produtos", index)}>
                <Ionicons name="trash" size={18} color={Colors.vermelho} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openModal("produtos", index)}>
                <Ionicons
                  name="pencil"
                  size={18}
                  color={Colors.azul}
                  style={{ marginRight: 5 }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.itemDetails}>
            <Text style={styles.itemInfo}>
              Qtd: {produto.quantidade} {produto.unidade}
            </Text>
            <Text style={styles.itemInfo}>
              Unit: R$ {Number(produto?.valorunitario || 0).toFixed(2)}
            </Text>
            <Text style={styles.itemTotal}>
              Total: R${" "}
              {(
                produto.quantidade * Number(produto.valorunitario || 0)
              ).toFixed(2)}
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
              <TouchableOpacity onPress={() => deleteItem("servicos", index)}>
                <Ionicons name="trash" size={18} color={Colors.vermelho} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openModal("servicos", index)}>
                <Ionicons
                  name="pencil"
                  size={18}
                  color={Colors.azul}
                  style={{ marginRight: 2 }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.itemDetails, { flexDirection: "row" }]}>
            <Text style={styles.itemTotal}>
              Mão de obra: R${" "}
              {Number(servico?.valor_mao_de_obra || 0).toFixed(2)}
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
      disabled={loading}
    >
      <Ionicons name="add-circle-outline" size={24} color={Colors.verde} />
      <Text style={styles.addButtonText}>
        Adicionar {section === "produtos" ? "Produto" : "Serviço"}
      </Text>
    </TouchableOpacity>
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
                  tempData.valorunitario !== undefined
                    ? String(tempData.valorunitario)
                    : ""
                }
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, valorunitario: text }))
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
              texto={loading ? "Salvando..." : "Salvar"}
              cor={Colors.verde}
              onPress={() => saveChanges("produtos")}
              disabled={loading}
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
              <Text style={styles.inputLabel}>Valor Mão de Obra</Text>
              <TextInput
                style={styles.input}
                value={
                  tempData.valor_mao_de_obra !== undefined
                    ? String(tempData.valor_mao_de_obra)
                    : ""
                }
                onChangeText={(text) =>
                  setTempData((prev) => ({ ...prev, valor_mao_de_obra: text }))
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
              texto={loading ? "Salvando..." : "Salvar"}
              cor={Colors.verde}
              onPress={() => saveChanges("servicos")}
              disabled={loading}
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
        title="Nota de Serviço"
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
          {renderSection(
            "VEÍCULO",
            "veiculo",
            <BillVehicleDropdown
              vehicles={vehiclesParam}
              selectedVehicleId={dadosNota.veiculo?.id}
              onVehicleChange={(veh) =>
                setDadosNota((prev) => ({ ...prev, veiculo: veh }))
              }
            />,
            null
          )}
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
          <GeneratePdfBtn dadosOrdemServico={dadosNota} />
          <TouchableOpacity
            style={[styles.botaoPrimario, { backgroundColor: Colors.verde }]}
            onPress={testarBotaoPDF}
          >
            <Ionicons name="bug" size={20} color="white" />
            <Text style={styles.textoBotaoPrimario}>Testar PDF</Text>
          </TouchableOpacity>

          {/* Modais */}
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
