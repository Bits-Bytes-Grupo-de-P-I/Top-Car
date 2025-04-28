import { Text, View, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

// Componentes
import Botao from "@/components/ui/Botao";
import Slider from "@/components/ui/Slider";
import Campo from "@/components/ui/CampoDeInfo";
import Emergencia from "@/components/ui/Emergencia";

export default function Index() {
  return (
    // Container principal
    <View style={styles.container}>
      {/* <Botao type='azul'/>
      <Botao type='verde'/>
      <Botao type='vermelho'/> 
      <Slider/>
      <Campo tipoDeInfo='Nome'/>
      <Campo tipoDeInfo='CPF / CNPJ'/>
      <Campo tipoDeInfo='CEP'/>
      <Emergencia />*/}
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
