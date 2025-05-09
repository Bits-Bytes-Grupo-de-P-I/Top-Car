import { Text, View, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

// Componentes
import Botao from "@/components/ui/Botao";
import Slider from "@/components/ui/Slider";
import CampoDeInput from "@/components/ui/CampoDeInput";
import Emergencia from "@/components/ui/Emergencia";
import StatusDeServico from "@/components/ui/StatusDeServico";
import Card from "@/components/ui/Card";

export default function Index() {
  return (
    // Container principal
    <View style={styles.container}>
      <Text>ÁREA DO CLIENTE</Text>
      <Botao type="azul" />
      <Botao type="verde" />
      <Botao type="vermelho" />
      <Slider />
      {/* <CampoDeInfo tipoDeInfo='Nome'/>
      <CampoDeInfo tipoDeInfo='CPF / CNPJ'/>
      <CampoDeInfo tipoDeInfo='CEP'/> */}
      <Emergencia />
      <StatusDeServico />
      <Card
        texto="Cadastrar novo cliente"
        cor={Colors.verde}
        iconName="user-plus"
      />
      <Card texto="Revisão" cor={Colors.amarelo} iconName="car" />
    </View>
    // Fim Container principal
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.azulClaro,
  },
});
