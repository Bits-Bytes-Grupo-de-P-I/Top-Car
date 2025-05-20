import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  SafeAreaView
} from "react-native";

import { useRouter } from "expo-router";

import Colors from "@/constants/Colors";

// Ícones
import Entypo from "@expo/vector-icons/Entypo";

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


// IMPORTANDO O COMPONENTE DE VOLTAR PARA PÁGINA INICIAL ----- ATENÇÃO EXCLUIR ELE APÓS A FINALIZAÇÃO DO PROJETO
import BackToHomeButton from "@/components/ui/BackToHomeButton";


export default function Index() {
  const router = useRouter();
  return (
      <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Container principal */}
        <ScrollView
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            {/* Barra do topo */}
            <View style={styles.barraTopo}>
              <Text
                style={{
                  fontFamily: "DM-Sans",
                  fontSize: 16,
                  fontWeight: "bold",
                  fontStyle: "italic",
                  color: "white",
                }}
              >
                Top Car
              </Text>
              <Entypo name="login" size={24} color="white" />
            </View>
            {/* Fim Barra do topo */}

            {/* Container conteudo */}
            <View style={styles.container}>
              {/* Container do titulo */}
              <View style={styles.containerTitulo}>
                <Text style={styles.titulo}>início</Text>
              </View>
              {/* Fim Container do titulo */}

              
              
              {/* ATENÇÃO EXCLUIR ESSE BOTAO */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text>Página do Cliente</Text>
                  <BackToHomeButton />
                </View>
              {/* ATENÇÃO EXCLUIR ESSE BOTAO */}



              {/* Container dos cards */}
              <View style={styles.containerCards}>
                <Card
                  texto="Cadastrar novo cliente"
                  cor={Colors.verde}
                  iconName="user-plus"
                  onPress={() => router.push("./admin/clientSignUp")}
                />
                <Card
                  texto="Pedidos de serviço"
                  cor={Colors.azulClaro}
                  iconName="car"
                  onPress={() => router.push("./admin/serviceRequests")}
                />
                <Card
                  texto="Serviços em andamento"
                  cor={Colors.amarelo}
                  iconName="clock"
                  onPress={() => router.push("./admin/ongoingServices")}
                />
                <Card
                  texto="Serviços em pendência"
                  cor={Colors.laranja}
                  iconName="triangle-exclamation"
                  onPress={() => router.push("./admin/pendingServices")}
                />
                <Card
                  texto="Gerar nota de serviço avulsa"
                  cor={Colors.grafite}
                  iconName="table-list"
                  onPress={() => router.push("./admin/generateBill")}
                />
              </View>
              {/* Fim Container dos cards */}

              {/* Container do titulo */}
              <View style={styles.containerTitulo}>
                <Text style={styles.titulo}>Clientes</Text>
              </View>
              {/* Fim Container do titulo */}

              {/* Container da lista de clientes */}
              <View style={styles.containerListaClientes}>
                <ListaClientes/>
              </View>
              {/* Fim Container da lista de clientes */}
            </View>
            {/* Fim Container conteudo */}
          </View>
        </ScrollView>
        {/* Fim Container principal */}
      </ImageBackground>
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
    paddingBottom: 64,
  },
  barraTopo: {
    height: 64,
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.azulClaro,
  },
  containerTitulo: {
    width: "100%",
    alignItems: "center",
    marginVertical: 32,
  },
  titulo: {
    fontSize: 24,
    fontFamily: "DM-Sans",
    fontWeight: "bold",
    color: Colors.azulClaro,
  },
  containerCards: {
    width: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  containerListaClientes: {
    width: "100%",
  },
});
