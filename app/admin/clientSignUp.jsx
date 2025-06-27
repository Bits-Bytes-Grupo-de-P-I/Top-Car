// Tela para cadastro de cliente e veículo vinculado a esse cliente
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

// COMPONENTES
import InputField from "@/components/InputField";
import Slider from "@/components/Slider";
import PageHeader from "@/components/PageHeader";
import { CpfCnpjInput, PhoneInput } from "@/components/MaskedInputs";

// CORES
import Colors from "@/constants/Colors";

const ClientSignUp = () => {
  // Estados para os dados do cliente
  const [documento, setDocumento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nome, setNome] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [estado, setEstado] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo_pessoa, setTipoPessoa] = useState("F"); // "F" ou "J"
  const [funcao, setFuncao] = useState("cliente"); // cliente ou admin

  // Estado para controlar o cadastro de veículo
  const [cadastrarVeiculo, setCadastrarVeiculo] = useState(false);

  // Estados para dados do veículo
  const [veiculo, setVeiculo] = useState();
  const [modelo, setModelo] = useState();
  const [ano, setAno] = useState();
  const [cor, setCor] = useState();
  const [km, setKm] = useState();
  const [placa, setPlaca] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // Limpa o formulário
  const handleClearForm = () => {
    setNome("");
    setEmail("");
    setSenha("");
    setDocumento("");
    setCep("");
    setCidade("");
    setEndereco("");
    setNumero("");
    setBairro("");
    setEstado("");
    setTelefone("");
    setTipoPessoa("");
    setFuncao("");

    // Limpa dados do veículo também
    setVeiculo("");
    setModelo("");
    setAno("");
    setCor("");
    setKm("");
    setPlaca("");
  };

  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJqb2FvQGV4YW1wbGUuY29tIiwiZnVuY2FvIjoiYWRtaW4iLCJpYXQiOjE3NDg0NTQzODR9.3fxamj4FEzv265boICnC3WqcJZLiJ0Kfsmbpg9S9lFs";

  // Função para cadastrar cliente na API
  const cadastrarCliente = async (clientData) => {
    console.log("=== DEBUG CADASTRO CLIENTE ===");
    console.log("URL:", "https://topcar-back-end.onrender.com/register");
    console.log("Dados enviados:", JSON.stringify(clientData, null, 2));
    console.log("Token:", authToken ? "Token presente" : "Token ausente");

    try {
      const response = await fetch(
        "https://topcar-back-end.onrender.com/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(clientData),
        }
      );

      console.log("Status da resposta:", response.status);
      console.log("Headers da resposta:", Object.fromEntries(response.headers));

      // Sempre lê o corpo da resposta
      const responseText = await response.text();
      console.log("Corpo da resposta (texto):", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Dados parseados:", data);
      } catch (parseError) {
        console.error("Erro ao parsear JSON:", parseError);
        throw new Error(`Resposta inválida do servidor: ${responseText}`);
      }

      if (!response.ok) {
        console.error("Erro HTTP:", response.status, data);
        throw new Error(
          data.error || data.message || `Erro HTTP ${response.status}`
        );
      }

      console.log("=== SUCESSO CADASTRO CLIENTE ===");
      return data;
    } catch (error) {
      console.error("=== ERRO CADASTRO CLIENTE ===");
      console.error("Tipo:", error.constructor.name);
      console.error("Mensagem:", error.message);
      console.error("Stack:", error.stack);
      console.error("=== FIM ERRO ===");
      throw error;
    }
  };

  // Função para cadastrar veículo na API - COM DEBUG MELHORADO
  const cadastrarVeiculoAPI = async (veiculoData) => {
    console.log("=== DEBUG CADASTRO VEÍCULO ===");
    console.log("URL:", "https://topcar-back-end.onrender.com/veiculos");
    console.log(
      "Dados do veículo enviados:",
      JSON.stringify(veiculoData, null, 2)
    );
    console.log("Token:", authToken ? "Token presente" : "Token ausente");
    console.log("Headers que serão enviados:", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    });

    try {
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

      console.log("Status da resposta do veículo:", response.status);
      console.log("Status OK?", response.ok);
      console.log(
        "Headers da resposta do veículo:",
        Object.fromEntries(response.headers)
      );

      // Sempre lê o corpo da resposta
      const responseText = await response.text();
      console.log("Corpo da resposta do veículo (texto):", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Dados parseados do veículo:", data);
      } catch (parseError) {
        console.error("Erro ao parsear JSON do veículo:", parseError);
        console.error("Resposta original:", responseText);
        throw new Error(
          `Resposta inválida do servidor para veículo: ${responseText}`
        );
      }

      if (!response.ok) {
        console.error(
          "Erro HTTP no cadastro do veículo:",
          response.status,
          data
        );
        throw new Error(
          data.error ||
            data.message ||
            `Erro HTTP ${response.status} no cadastro do veículo`
        );
      }

      console.log("=== SUCESSO CADASTRO VEÍCULO ===");
      return data;
    } catch (error) {
      console.error("=== ERRO CADASTRO VEÍCULO ===");
      console.error("Tipo:", error.constructor.name);
      console.error("Mensagem:", error.message);
      console.error("Stack:", error.stack);
      console.error("=== FIM ERRO VEÍCULO ===");
      throw error;
    }
  };

  const handleSubmit = async () => {
    // Validação básica - verificando se os campos obrigatórios não estão vazios
    if (
      !nome?.trim() ||
      !documento?.trim() ||
      !telefone?.trim() ||
      !email?.trim() ||
      !senha?.trim()
    ) {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha nome, documento, telefone, email e senha."
      );
      return;
    }

    // Validação para veículo se estiver marcado para cadastrar
    if (
      cadastrarVeiculo &&
      (!veiculo?.trim() || !modelo?.trim() || !ano?.trim() || !placa?.trim())
    ) {
      Alert.alert(
        "Dados do veículo",
        "Por favor, preencha todos os campos obrigatórios do veículo."
      );
      return;
    }

    setIsLoading(true);

    try {
      // 1. Cadastrar cliente primeiro
      const clientData = {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: senha.trim(),
        tipo_pessoa: tipo_pessoa,
        documento: documento.trim(),
        telefone: telefone.trim(),
        funcao: funcao,
        cep: cep.replace(/\D/g, "").trim(),
        cidade: cidade?.trim(),
        endereco: endereco?.trim(),
        numero: numero?.trim(),
        bairro: bairro?.trim(),
        estado: estado?.trim(),
      };

      const clientResponse = await cadastrarCliente(clientData);

      // 2. Se o cliente foi cadastrado com sucesso e tem veículo para cadastrar
      if (cadastrarVeiculo) {
        // Verificar se temos o ID do cliente
        if (!clientResponse.clienteId) {
          console.error(
            "ERRO: Cliente ID não encontrado na resposta:",
            clientResponse
          );
          throw new Error("ID do cliente não foi retornado pelo servidor");
        }

        const veiculoData = {
          cliente_id: clientResponse.clienteId, // ID retornado do cliente
          marca: veiculo.trim(), // O campo "veiculo" do frontend vira "marca" no backend
          modelo: modelo.trim(),
          ano: parseInt(ano.trim()),
          placa: placa.trim(),
          cor: cor?.trim() || null,
          km: km ? parseInt(km.trim()) : null,
          ultima_manutencao: null,
        };

        const veiculoResponse = await cadastrarVeiculoAPI(veiculoData);
        console.log("Veículo cadastrado com sucesso:", veiculoResponse);
      } else {
        console.log("Cadastro de veículo não solicitado");
      }

      // Sucesso
      console.log("=== CADASTRO FINALIZADO COM SUCESSO ===");
      Alert.alert(
        "Cadastro Realizado",
        cadastrarVeiculo
          ? "Cliente e veículo cadastrados com sucesso!"
          : "Cliente cadastrado com sucesso!",
        [
          {
            text: "OK",
            onPress: () => {
              handleClearForm();
            },
          },
        ]
      );
    } catch (error) {
      console.error("=== ERRO GERAL NO CADASTRO ===");
      console.error("Erro ao cadastrar:", error);

      let errorMessage =
        "Não foi possível realizar o cadastro. Por favor, tente novamente.";

      if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Erro", errorMessage);
    } finally {
      setIsLoading(false);
      console.log("=== FIM DO PROCESSO DE CADASTRO ===");
    }
  };

  // 4. Função para determinar tipo de pessoa baseado no documento
  const handleDocumentoChange = (value) => {
    setDocumento(value);

    // Auto-detectar tipo de pessoa baseado no documento
    const somenteNumeros = value.replace(/\D/g, "");
    if (somenteNumeros?.length <= 11) {
      setTipoPessoa("F"); // CPF
    } else {
      setTipoPessoa("J"); // CNPJ
    }
  };

  const handleTelefoneChange = (value) => {
    console.log("Telefone recebido:", value);
    setTelefone(value);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageHeader
        title="Cadastro de Cliente"
        containerStyle={{ backgroundColor: Colors.azulClaro }}
        titleStyle={{ color: "#fff" }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Dados Pessoais</Text>
            <Text style={styles.sectionSubtitle}>
              Informe os dados do cliente para realizar o cadastro
            </Text>

            <View style={styles.formGroup}>
              <InputField
                tipoDeInfo="Nome Completo"
                keyboardType="default"
                mascara=""
                valor={nome}
                onChangeText={setNome}
                placeholder="Digite o nome completo"
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 2, marginRight: 8 }]}>
                <CpfCnpjInput
                  label="CPF / CNPJ"
                  valor={documento}
                  placeholder="CPF / CNPJ"
                  onChangeText={handleDocumentoChange}
                />
              </View>

              <View style={[styles.formGroup, { flex: 2 }]}>
                <PhoneInput
                  label="Telefone"
                  valor={telefone}
                  placeholder="Digite seu telefone"
                  onChangeText={handleTelefoneChange}
                />
              </View>
            </View>

            <View style={[styles.formGroup, { flex: 2 }]}>
              <InputField
                tipoDeInfo="Email"
                keyboardType="email-address"
                mascara=""
                valor={email}
                onChangeText={setEmail}
                placeholder="Digite seu email"
              />
            </View>

            <View style={styles.formGroup}>
              <InputField
                tipoDeInfo="Crie uma senha para você"
                keyboardType="default"
                mascara=""
                valor={senha}
                onChangeText={setSenha}
                placeholder="Digite sua senha"
                secureTextEntry={true}
              />
            </View>

            <Text style={styles.sectionTitle}>Endereço</Text>
            <Text style={styles.sectionSubtitle}>
              Informe os dados de endereço do cliente
            </Text>

            <View style={styles.formGroup}>
              <InputField
                tipoDeInfo="CEP"
                keyboardType="numeric"
                mascara="99999-999"
                valor={cep}
                onChangeText={setCep}
                placeholder="00000-000"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 2, marginRight: 8 }]}>
                <InputField
                  tipoDeInfo="Cidade"
                  keyboardType="default"
                  mascara=""
                  valor={cidade}
                  onChangeText={setCidade}
                  placeholder="Cidade"
                  largura="100%"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <InputField
                  tipoDeInfo="Estado"
                  keyboardType="default"
                  largura="100%"
                  valor={estado}
                  onChangeText={(text) => setEstado(text.toUpperCase())}
                  mascara="AA"
                  placeholder="UF"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <InputField
                tipoDeInfo="Endereço"
                keyboardType="default"
                mascara=""
                valor={endereco}
                onChangeText={setEndereco}
                placeholder="Rua/Avenida"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <InputField
                  tipoDeInfo="Número"
                  keyboardType="numeric"
                  largura="100%"
                  mascara="99999"
                  valor={numero}
                  onChangeText={setNumero}
                  placeholder="Nº"
                />
              </View>
              <View style={[styles.formGroup, { flex: 2 }]}>
                <InputField
                  tipoDeInfo="Bairro"
                  keyboardType="default"
                  mascara=""
                  largura="100%"
                  valor={bairro}
                  onChangeText={setBairro}
                  placeholder="Bairro"
                />
              </View>
            </View>

            <View style={styles.switchContainer}>
              <View style={styles.switchGroup}>
                <Text style={styles.switchLabel}>Cadastrar Veículo</Text>
                <Text style={styles.switchDescription}>
                  Marque esta opção para cadastrar um veículo para o cliente
                </Text>
              </View>
              <Slider value={cadastrarVeiculo} onChange={setCadastrarVeiculo} />
            </View>

            {cadastrarVeiculo && (
              <>
                <Text style={styles.sectionTitle}>Veículo</Text>
                <Text style={styles.sectionSubtitle}>
                  Informe os dados do veículo do cliente
                </Text>

                <View style={styles.formGroup}>
                  <InputField
                    tipoDeInfo="Veículo"
                    keyboardType="default"
                    valor={veiculo}
                    onChangeText={setVeiculo}
                    placeholder="Ex: Kwid"
                  />
                </View>

                <View style={styles.formGroup}>
                  <InputField
                    tipoDeInfo="Modelo"
                    keyboardType="default"
                    valor={modelo}
                    onChangeText={setModelo}
                    placeholder="Ex: Zen"
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <InputField
                      tipoDeInfo="Ano"
                      keyboardType="numeric"
                      largura="100%"
                      valor={ano}
                      onChangeText={setAno}
                      placeholder="2023"
                    />
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <InputField
                      tipoDeInfo="Cor"
                      keyboardType="default"
                      largura="100%"
                      valor={cor}
                      onChangeText={setCor}
                      placeholder="Branco"
                    />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <InputField
                      tipoDeInfo="KM"
                      keyboardType="number-pad"
                      largura="100%"
                      valor={km}
                      onChangeText={setKm}
                      placeholder="Ex: 45000"
                    />
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <InputField
                      tipoDeInfo="Placa"
                      keyboardType="default"
                      largura="100%"
                      mascara="AAA-9A99"
                      placeholder="ABC1234"
                      valor={placa}
                      onChangeText={(text) => setPlaca(text.toUpperCase())}
                    />
                  </View>
                </View>
              </>
            )}

            {/* Botões de Ação */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearForm}
                disabled={isLoading}
              >
                <Text style={styles.clearButtonText}>Limpar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Text style={styles.submitButtonText}>Cadastrando...</Text>
                ) : (
                  <>
                    <MaterialIcons
                      name="check-circle"
                      size={18}
                      color="#fff"
                      style={styles.sendIcon}
                    />
                    <Text style={styles.submitButtonText}>Cadastrar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ClientSignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Espaço extra no final
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 24,
  },
  switchGroup: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  switchDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  switchButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    minWidth: 70,
    alignItems: "center",
  },
  switchButtonActive: {
    backgroundColor: Colors.azulClaro,
  },
  switchButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  switchButtonTextActive: {
    color: "#fff",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 32,
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: Colors.azulClaro,
    minWidth: 100,
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  submitButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.verde,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 12,
  },
  disabledButton: {
    backgroundColor: "#b3d4ff",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  sendIcon: {
    marginRight: 8,
  },
});