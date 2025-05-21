import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";

// Componentes
import InputField from "@/components/ui/InputField";
import Slider from "@/components/ui/Slider";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";

import Colors from "@/constants/Colors";

const clientSignUp = () => {
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

  // Estado para controlar o slider de cadastro de veículo
  const [cadastrarVeiculo, setCadastrarVeiculo] = useState(false);

  // Estados para dados do veículo
  const [veiculo, setVeiculo] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [cor, setCor] = useState("");
  const [km, setKm] = useState("");
  const [placa, setPlaca] = useState("");

  return (
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
      <ScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.containerPrincipal}>
            {/* Container dos campos de cadastro */}
            <View style={styles.container}>
              <InputField
                tipoDeInfo="Nome"
                keyboardType="default"
                valor={nome}
                onChangeText={setNome}
                placeholder="Digite o nome completo"
              />
              <InputField
                tipoDeInfo="CPF/CNPJ"
                keyboardType="number-pad"
                mascara="999.999.999-99" // FALTA A LÓGICA DE DIFERENCIAR O CPF DO CNPJ
                valor={cpf}
                onChangeText={setCpf}
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
              />
              <InputField
                tipoDeInfo="CEP"
                keyboardType="numeric"
                mascara="99999-999"
                valor={cep}
                onChangeText={setCep}
                placeholder="00000-000"
              />
              <View style={styles.containerInterior}>
                <InputField
                  tipoDeInfo="Cidade"
                  keyboardType="default"
                  valor={cidade}
                  onChangeText={setCidade}
                  placeholder="Cidade"
                  largura="65%"
                />
                <InputField
                  tipoDeInfo="Estado"
                  keyboardType="default"
                  largura="30%"
                  valor={estado}
                  onChangeText={(text) => setEstado(text.toUpperCase())}
                  mascara="AA"
                  placeholder="UF"
                />
              </View>
              <InputField
                tipoDeInfo="Endereço"
                keyboardType="default"
                valor={endereco}
                onChangeText={setEndereco}
                placeholder="Rua/Avenida"
              />

              <View style={styles.containerInterior}>
                <InputField
                  tipoDeInfo="Número"
                  keyboardType="numeric"
                  largura="30%"
                  valor={numero}
                  onChangeText={setNumero}
                  placeholder="Nº"
                />
                <InputField
                  tipoDeInfo="Bairro"
                  keyboardType="default"
                  largura="65%"
                  valor={bairro}
                  onChangeText={setBairro}
                  placeholder="Rua/Avenida"
                />
              </View>
              <InputField
                tipoDeInfo="Telefone"
                keyboardType=""
                valor={telefone}
                onChangeText={setTelefone}
                mascara="(99) 99999-9999"
                placeholder="(00) 00000-0000"
              />
              {/* Container dos botões de cadastro do cliente */}
              <View style={styles.containerBotoes}>
                <Button cor="verde" texto="Cadastrar" />
                <Button cor="vermelho" texto="Cancelar" />
              </View>
              {/* Fim Container dos botões de cadastro do cliente */}
            </View>
            {/* Fim Container dos campos do cliente */}

            {/* Container do slider */}
            <View style={styles.containerSlider}>
              <Text
                style={{ fontSize: 18, fontFamily: "DM-Sans", color: "white" }}
              >
                Cadastrar Veículo
              </Text>
              <Slider
                value={cadastrarVeiculo}
                onChange={(value) => setCadastrarVeiculo(value)}
              />
            </View>
            {/* Fim Container do slider */}

            {/* Formulário de cadastro de veículo - aparece apenas quando o slider está ativado */}
            {cadastrarVeiculo && (
              <View style={styles.container}>
                <Text style={styles.subtituloSecao}>Cadastro de Veículo</Text>

                <InputField
                  tipoDeInfo="Veículo"
                  keyboardType="default"
                  valor={veiculo}
                  onChangeText={setVeiculo}
                  placeholder="Ex: Kwid"
                />
                <InputField
                  tipoDeInfo="Modelo"
                  keyboardType="default"
                  valor={modelo}
                  onChangeText={setModelo}
                  placeholder="Ex: Zen"
                />

                <View style={styles.containerInterior}>
                  <InputField
                    tipoDeInfo="Ano"
                    keyboardType="numeric"
                    largura="48%"
                    valor={ano}
                    onChangeText={setAno}
                    placeholder="2023"
                  />
                  <InputField
                    tipoDeInfo="Cor"
                    keyboardType="default"
                    largura="48%"
                    valor={cor}
                    onChangeText={setCor}
                    placeholder="Branco"
                  />

                  <View style={styles.containerInterior}>
                    <InputField
                      tipoDeInfo="KM"
                      keyboardType="number-pad"
                      largura="48%"
                      valor={km}
                      onChangeText={setKm}
                      placeholder="Ex: 45000"
                    />
                    <InputField
                      tipoDeInfo="Placa"
                      keyboardType="default"
                      largura="48%"
                      mascara="AAA-9A99"
                      placeholder="ABC1234"
                      valor={placa}
                      onChangeText={(text) => setPlaca(text.toUpperCase())}
                    />
                  </View>
                </View>

                <View style={styles.containerBotoes}>
                  <Button cor="verde" texto="Cadastrar" />
                  <Button cor="vermelho" texto="Cancelar" />
                </View>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </ImageBackground>
  );
};

export default clientSignUp;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  containerPrincipal: {
    padding: 20,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.azulClaro,
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
  },
  containerInterior: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 14,
  },
  containerBotoes: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexWrap: "nowrap",
    backgroundColor: Colors.azulClaro,
    borderRadius: 10,
  },
  containerSlider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.azulClaro,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  subtituloSecao: {
    marginTop: 16,
    marginBottom: 16,
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
