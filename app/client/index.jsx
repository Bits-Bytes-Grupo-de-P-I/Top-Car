// Página inicial do cliente

import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context"; // Esse import precisa ser diferente para funcionar corretamente
import { StatusBar } from "expo-status-bar";

// COMPONENTES
import Card from "@/components/Card";
import CardWork from "@/components/client/CardWork";

// ÍCONES
import {
  Entypo,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

// CORES
import Colors from "@/constants/Colors";

// IMPORTANDO O COMPONENTE DE VOLTAR PARA PÁGINA INICIAL ----- ATENÇÃO EXCLUIR ELE APÓS A FINALIZAÇÃO DO PROJETO .
import BackToHomeButton from "@/components/BackToHomeButton";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
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
              <Image
                source={require("@/assets/images/logo.png")}
                style={{ width: 120, height: 120 }}
              />
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
                  texto="Meus serviços em andamento"
                  cor={Colors.azulClaro}
                  onPress={() => router.push("./client/serviceStatus")}
                >
                  <FontAwesome6
                    style={{ marginBottom: 4 }}
                    name="car" // tem o ícone "car-on" também
                    size={30}
                    color={Colors.azulClaro}
                  />
                </Card>

                <Card
                  texto="Serviços pendentes"
                  cor={Colors.laranja}
                  onPress={() => router.push("./client/servicePending")}
                >
                  <FontAwesome6
                    style={{ marginBottom: 4 }}
                    name="triangle-exclamation"
                    size={30}
                    color={Colors.laranja}
                  />
                </Card>

                <Card
                  texto="Solicitar pedido de atendimento"
                  cor={Colors.amarelo}
                  onPress={() => router.push("./client/serviceRequestForm")}
                >
                  <FontAwesome6
                    style={{ marginBottom: 4 }}
                    name="pen-to-square"
                    size={30}
                    color={Colors.amarelo}
                  />
                </Card>

                <Card
                  texto="Serviços realizados"
                  cor={Colors.verde}
                  onPress={() => router.push("./client/serviceHistory")}
                >
                  <FontAwesome6
                    style={{ marginBottom: 4 }}
                    name="gear"
                    size={30}
                    color={Colors.verde}
                  />
                </Card>

                {/* APAGAR ESSE CARD */}
                <Card
                  texto="Sobre o App"
                  cor={Colors.azul}
                  onPress={() => router.push("./client/lgpdInfoPage")}
                >
                  <MaterialCommunityIcons
                    style={{ marginBottom: 4 }}
                    name="card-text"
                    size={30}
                    color={Colors.azul}
                  />
                </Card>
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
  containerShortClientList: {
    width: "100%",
  },
});
