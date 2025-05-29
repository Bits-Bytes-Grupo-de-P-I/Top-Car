import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

// Componentes
import InputField from "@/components/InputField";
import Slider from "@/components/Slider";
import PageHeader from "@/components/PageHeader";
import Colors from "@/constants/Colors";

const ClientSignUp = () => {
  // Estados para os dados do cliente
  const [cpf, setCpf] = useState("");
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
    setCpf("");
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
    if (!nome || !cpf || !telefone || !endereco) {
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
        cpf,
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
      console.log("Enviando dados:", clientData);

      // Aqui você faria sua chamada para a API
      // await api.post('/clients', clientData);

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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
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
              <InputField
                tipoDeInfo="CPF/CNPJ"
                keyboardType="number-pad"
                mascara="999.999.999-99"
                valor={cpf}
                onChangeText={setCpf}
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
              />
            </View>

            <View style={styles.formGroup}>
              <InputField
                tipoDeInfo="Telefone"
                keyboardType="phone-pad"
                valor={telefone}
                onChangeText={setTelefone}
                mascara="(99) 99999-9999"
                placeholder="(00) 00000-0000"
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
                style={[
                  styles.submitButton,
                  isLoading && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Text style={styles.submitButtonText}>Cadastrando...</Text>
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Cadastrar</Text>
                    <MaterialIcons
                      name="check-circle"
                      size={18}
                      color="#fff"
                      style={styles.sendIcon}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* </ImageBackground> */}
    </SafeAreaView>
  );
};

export default ClientSignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f9f9f9",
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
    marginLeft: 8,
  },
});
