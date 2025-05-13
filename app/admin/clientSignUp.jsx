import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";

// Componentes
import CampoDeInput from "@/components/ui/CampoDeInput";
import Slider from "@/components/ui/Slider";
import Botao from "@/components/ui/Botao";

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
      <ScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.containerPrincipal}>
          {/* Container dos campos de cadastro */}
          <View style={styles.container}>
            <CampoDeInput
              tipoDeInfo="Nome"
              keyboardType="default"
              valor={nome}
              onChangeText={setNome}
            />
            <CampoDeInput
              tipoDeInfo="CPF/CNPJ"
              keyboardType="number-pad"
              mascara="999.999.999-99"
              valor={cpf}
              onChangeText={setCpf}
            />
            <CampoDeInput
              tipoDeInfo="CEP"
              keyboardType="numeric"
              mascara="99999-999"
              valor={cep}
              onChangeText={setCep}
            />
            <CampoDeInput
              tipoDeInfo="Cidade"
              keyboardType="default"
              valor={cidade}
              onChangeText={setCidade}
            />
            <View style={styles.containerInterior}>
              <CampoDeInput
                tipoDeInfo="Endereço"
                keyboardType="default"
                largura="65%"
                valor={endereco}
                onChangeText={setEndereco}
              />
              <CampoDeInput
                tipoDeInfo="Número"
                keyboardType="numeric"
                largura="30%"
                valor={numero}
                onChangeText={setNumero}
              />
            </View>
            <View style={styles.containerInterior}>
              <CampoDeInput
                tipoDeInfo="Bairro"
                keyboardType="default"
                largura="65%"
                valor={bairro}
                onChangeText={setBairro}
              />
              <CampoDeInput
                tipoDeInfo="Estado"
                keyboardType="default"
                largura="30%"
                valor={estado}
                onChangeText={(text) => setEstado(text.toUpperCase())}
                mascara="AA"
              />
            </View>
            <CampoDeInput
              tipoDeInfo="Telefone"
              keyboardType=""
              valor={telefone}
              onChangeText={setTelefone}
            />
            {/* Container dos botões de cadastro do cliente */}
            <View style={styles.containerBotoes}>
              <Botao cor="verde" texto="Cadastrar" />
              <Botao cor="vermelho" texto="Cancelar" />
            </View>
            {/* Fim Container dos botões de cadastro do cliente */}

            {/* Container do slider */}
            <View style={styles.containerBotoes}>
              <Text
                style={{ fontSize: 20, fontFamily: "DM-Sans", color: "#fff" }}
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
              <View style={styles.containerVeiculo}>
                <Text style={styles.subtituloSecao}>Cadastro de Veículo</Text>

                <View style={styles.containerInterior}>
                  <CampoDeInput
                    tipoDeInfo="Veículo"
                    keyboardType="default"
                    largura="48%"
                    valor={veiculo}
                    onChangeText={(text) => setVeiculo(text.toUpperCase())}
                    mascara="AAA-9A99"
                  />
                  <CampoDeInput
                    tipoDeInfo="Modelo"
                    keyboardType="default"
                    largura="48%"
                    valor={modelo}
                    onChangeText={setModelo}
                  />
                </View>

                <View style={styles.containerInterior}>
                  <CampoDeInput
                    tipoDeInfo="Ano"
                    keyboardType="numeric"
                    largura="48%"
                    valor={ano}
                    onChangeText={setAno}
                  />
                  <CampoDeInput
                    tipoDeInfo="Cor"
                    keyboardType="default"
                    largura="48%"
                    valor={cor}
                    onChangeText={setCor}
                  />

                  <View style={styles.containerInterior}>
                    <CampoDeInput
                      tipoDeInfo="KM"
                      keyboardType="number-pad"
                      largura="48%"
                      valor={km}
                      onChangeText={setKm}
                    />
                    <CampoDeInput
                      tipoDeInfo="Placa"
                      keyboardType="default"
                      largura="48%"
                      mascara="AAA-9A99"
                      valor={placa}
                      onChangeText={(text) => setPlaca(text.toUpperCase())}
                    />
                  </View>
                </View>

                <View style={styles.containerBotoes}>
                  <Botao cor="verde" texto="Cadastrar" />
                  <Botao cor="vermelho" texto="Cancelar" />
                </View>
              </View>
            )}
          </View>
          {/* Fim Container dos campos do cliente */}
        </View>
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
    paddingHorizontal: 28,
    paddingVertical: 32,
    borderRadius: 10,
  },
  containerInterior: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  containerBotoes: {
    marginTop: 32,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexWrap: "nowrap",
  },
  subtituloSecao: {
    marginVertical: 32,
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
