import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context"; //import para concertar a tela no celular
import { useRouter } from "expo-router";

import Colors from "@/constants/Colors";
// Ícones
import Entypo from "@expo/vector-icons/Entypo";

// Componentes

import Card from "@/components/ui/Card";
import ClientList from "@/components/ui/ClientList";

import CardWork from "@/components/ui/CardWork";

// IMPORTANDO O COMPONENTE DE VOLTAR PARA PÁGINA INICIAL ----- ATENÇÃO EXCLUIR ELE APÓS A FINALIZAÇÃO DO PROJETO
import BackToHomeButton from "@/components/ui/BackToHomeButton";

export default function Index() {
  const router = useRouter();

  const navigateToServicePending = () => {
    router.push("/client/ServicePending");
  };

  const navigateToHistoryScreen = () => {
    router.push("/client/HistoryScreen");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* SafeAreaView para concertar a tela no celular */}
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

              {/* ATENÇÃO EXCLUIR ESSE Button */}
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Página do Cliente</Text>
                <BackToHomeButton />
              </View>
              {/* ATENÇÃO EXCLUIR ESSE Button */}

              {/* Container dos cards */}
              <View style={styles.containerCards}>
                <Card
                  texto="Status do serviço"
                  cor={Colors.verde}
                  iconName="car"
                />
                <Card
                  texto="Serviços pendentes"
                  cor={Colors.laranja}
                  iconName="triangle-exclamation"
                  onPress={navigateToServicePending}
                />
                <Card
                  texto="Gerar pedido de atendimento"
                  cor={Colors.amarelo}
                  iconName="pen-to-square"
                />
                {/* <Card
                  texto="Dúvidas frequentes"
                  cor={Colors.azul}
                  iconName="circle-question"
                /> */}
                <Card
                  texto="Serviços realizados"
                  cor={Colors.verdeEscuro}
                  iconName="gear"
                  onPress={navigateToHistoryScreen}
                />
              </View>
              {/* Fim Container dos cards */}

              <CardWork />
            </View>
            {/* Fim Container conteudo */}
          </View>
        </ScrollView>
        {/* Fim Container principal */}
      </ImageBackground>
    </SafeAreaView>
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
  containerClientList: {
    width: "100%",
  },

  // //suahsuhaushaushauhsaushauhsuahs

  // container: {
  //   flex: 1,
  //   padding: 16,
  // },
  // welcomeTitle: {
  //   fontSize: 20,
  //   color: '#6B7280', // gray-600
  // },
  // appTitle: {
  //   fontSize: 32,
  //   fontWeight: 'bold',
  //   color: '#1F2937', // gray-800
  //   marginBottom: 24,
  // },
  // sectionTitle: {
  //   fontSize: 18,
  //   fontWeight: '600',
  //   color: '#4B5563', // gray-700
  //   marginBottom: 12,
  // },
});
