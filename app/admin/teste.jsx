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
          <Text>ÁREA DO ADMIN</Text>
          <Botao type="azul" />
          <Botao type="verde" />
          <Botao type="vermelho" />
          <Slider />
          <CampoDeInput tipoDeInfo="Nome" />
          <CampoDeInput tipoDeInfo="CPF / CNPJ" />
          <CampoDeInput tipoDeInfo="CEP" />
          <Emergencia />
          <StatusDeServico />
          <Card
            texto="Cadastrar novo cliente"
            cor={Colors.verde}
            iconName="user-plus"
          />
          <Card texto="Revisão" cor={Colors.amarelo} iconName="car" />
          <VerMais />
          <ServicosPadrao texto="Sei lá o que" preco="R$ 150,00" />
          <ListaClientes />
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
