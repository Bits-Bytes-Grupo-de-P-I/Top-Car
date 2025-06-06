// Tela para cadastro de cliente e veículo vinculado a esse cliente

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ImageBackground,
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
  const [maskedValue, setMaskedValue] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nome, setNome] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [estado, setEstado] = useState("");

  // Estado para controlar o cadastro de veículo
  const [cadastrarVeiculo, setCadastrarVeiculo] = useState(false);

  // Estados para dados do veículo
  const [veiculo, setVeiculo] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [cor, setCor] = useState("");
  const [km, setKm] = useState("");
  const [placa, setPlaca] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Limpa o formulário
  const handleClearForm = () => {
    setNome("");
    setDocumento("");
    setCep("");
    setCidade("");
    setEndereco("");
    setNumero("");
    setBairro("");
    setEstado("");
    setTelefone("");

    // Limpa dados do veículo também
    setVeiculo("");
    setModelo("");
    setAno("");
    setCor("");
    setKm("");
    setPlaca("");
  };

  // Função para cadastrar cliente
  const handleSubmit = async () => {
    // Validação básica
    if (!nome || !documento || !telefone || !endereco) {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha todos os campos obrigatórios."
      );
      return;
    }

    setIsLoading(true);

    try {
      // Preparar dados para envio
      const clientData = {
        nome,
        documento, // Talvez tenha que mudar depois
        cep,
        cidade,
        endereco,
        numero,
        bairro,
        estado,
        telefone,
        veiculo: cadastrarVeiculo
          ? {
              nome: veiculo,
              modelo,
              ano,
              cor,
              km,
              placa,
            }
          : null,
      };

      // Simulação de envio para API
      // console.log("Enviando dados:", clientData);

      // Simulando um tempo de processamento
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert("Cadastro Realizado", "Cliente cadastrado com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            handleClearForm();
            // router.back(); // Se quiser voltar para tela anterior
          },
        },
      ]);
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      Alert.alert(
        "Erro",
        "Não foi possível cadastrar o cliente. Por favor, tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Formatações de CPF e CNPJ (não deu pra usar o componente de inputField pois a mascara dele não aceita valores condicionais)
  const applyMask = (text) => {
    // Remove tudo que não for caracter numérico
    const cleaned = text.replace(/\D/g, "");

    if (cleaned.length <= 11) {
      // Máscara de CPF: 000.000.000-00
      return cleaned
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    } else {
      // Máscara de CNPJ: 00.000.000/0000-00
      return cleaned
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    }
  };

  // Função para lidar com mudanças no texto:
  const handleTextChange = (text) => {
    const masked = applyMask(text);
    setMaskedValue(masked);

    // Salvar apenas os números no documento (sem os . e /)
    const numbersOnly = text.replace(/\D/g, "");
    setDocumento(numbersOnly);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageHeader
        title="Cadastro de Cliente"
        containerStyle={{ backgroundColor: Colors.azulClaro }}
        titleStyle={{ color: "#fff" }}
      />
      {/* <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      > */}
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>
          <Text style={styles.sectionSubtitle}>
            Informe os dados do cliente para realizar o cadastro
          </Text>

          <View style={styles.formGroup}>
            <InputField
              tipoDeInfo="Nome Completo"
              keyboardType="default"
              valor={nome}
              onChangeText={setNome}
              placeholder="Digite o nome completo"
            />
          </View>

          <View style={styles.formGroup}>
            <CpfCnpjInput
              label="CPF/CNPJ"
              placeholder="Digite seu CPF ou CNPJ"
              onChangeText={(value) => console.log("Números:", value)}
            />
          </View>

          <View style={styles.formGroup}>
            <PhoneInput
              label="Telefone"
              placeholder="Digite seu telefone"
              onChangeText={(value) => console.log("Números:", value)}
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
                valor={numero}
                onChangeText={setNumero}
                placeholder="Nº"
              />
            </View>
            <View style={[styles.formGroup, { flex: 2 }]}>
              <InputField
                tipoDeInfo="Bairro"
                keyboardType="default"
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
      {/* </ImageBackground> */}
    </SafeAreaView>
  );
};

export default ClientSignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
