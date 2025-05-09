import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import Colors from "@/constants/Colors";

// Componentes
import Botao from "@/components/ui/Botao";
import Slider from "@/components/ui/Slider";
import CampoDeInput from "@/components/ui/CampoDeInput";
import Emergencia from "@/components/ui/Emergencia";
import StatusDeServico from "@/components/ui/StatusDeServico";
import Card from "@/components/ui/Card";
import VerMais from "@/components/ui/VerMais";
import ServicosPadrao from "@/components/ui/ServicosPadrao";
import ListaClientes from "@/components/ui/ListaClientes";

export default function Index() {
  return (
    // Container principal
    <ImageBackground
      source={require("@/assets/images/fundo.jpg")} // coloque a imagem na pasta certa
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView>
        <View style={styles.container}>
          
        </View>
      </ScrollView>
    </ImageBackground>
    // Fim Container principal
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
