import { Text, View, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

// Componentes
import Botao from "@/components/ui/Botao";
import Slider from "@/components/ui/Slider";
import CampoDeInfo from "@/components/ui/CampoDeInfo";
import Emergencia from "@/components/ui/Emergencia";
import StatusDeServico from "@/components/ui/StatusDeServico";

export default function Index() {
  return (
    // Container principal
    <View style={styles.container}>
      {/* <Botao type='azul'/>*/}
      <Botao type='verde'/>
      <Botao type='vermelho'/> 
      <Slider/>
      <CampoDeInfo tipoDeInfo='Nome'/>
      <CampoDeInfo tipoDeInfo='CPF / CNPJ'/>
      <CampoDeInfo tipoDeInfo='CEP'/>
      <Emergencia />
      <StatusDeServico />
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
