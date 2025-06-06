// Tela inical com os cards e lista de clientes reduzida

import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';

// COMPONENTES
import Card from "@/components/Card";
import ShortClientList from "@/components/admin/ShortClientList";
import BackToHomeButton from "@/components/BackToHomeButton";

// ÍCONES
import { Entypo, FontAwesome6 } from "@expo/vector-icons";

// CORES
import Colors from "@/constants/Colors";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" /> {/* Define o estilo da barra de status */}
      <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Barra do topo */}
        <View style={styles.barraTopo}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 120, height: 120 }}
          />

          <Entypo name="login" size={24} color="white" />
        </View>

        {/* Container principal - usando ScrollView */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={true}
        >
          {/* Título Início */}
          <View style={styles.containerTitulo}>
            <Text style={styles.titulo}>início</Text>
          </View>

          {/* Botão Admin */}
          <View style={styles.containerAdminButton}>
            <Text>Página do administrador</Text>
            <BackToHomeButton />
          </View>

          {/* Cards */}
          <View style={styles.containerCards}>
            <Card
              texto="Cadastrar novo cliente"
              cor={Colors.verde}
              onPress={() => router.push("./admin/clientSignUp")}
            >
              <FontAwesome6
                style={{ marginBottom: 4 }}
                name="user-plus"
                size={30}
                color={Colors.verde}
              />
            </Card>
            <Card
              texto="Pedidos de serviço"
              cor={Colors.azulClaro}
              onPress={() => router.push("./admin/serviceRequests")}
            >
              <FontAwesome6
                style={{ marginBottom: 4 }}
                name="car"
                size={30}
                color={Colors.azulClaro}
              />
            </Card>
            <Card
              texto="Serviços em andamento"
              cor={Colors.amarelo}
              onPress={() => router.push("./admin/ongoingServices")}
            >
              <FontAwesome6
                style={{ marginBottom: 4 }}
                name="clock"
                size={30}
                color={Colors.amarelo}
              />
            </Card>
            <Card
              texto="Serviços em pendência"
              cor={Colors.laranja}
              onPress={() => router.push("./admin/pendingServices")}
            >
              <FontAwesome6
                style={{ marginBottom: 4 }}
                name="triangle-exclamation"
                size={30}
                color={Colors.laranja}
              />
            </Card>
            <Card
              texto="Gerar nota de serviço avulsa"
              cor={Colors.grafite}
              iconName="table-list"
              onPress={() => router.push("./admin/serviceBill")}
            >
              <FontAwesome6
                style={{ marginBottom: 4 }}
                name="table-list"
                size={30}
                color={Colors.grafite}
              />
            </Card>
            {/* <Card
              texto="Gerar nota de serviço avulsa"
              cor={Colors.grafite}
              iconName="table-list"
              onPress={() => router.push("./admin/testePdf")}
            >
              <FontAwesome6
                style={{ marginBottom: 4 }}
                name="table-list"
                size={30}
                color={Colors.grafite}
              />
            </Card> */}
          </View>

          {/* Título Clientes */}
          <View style={styles.containerTitulo}>
            <Text style={styles.titulo}>Clientes</Text>
          </View>

          {/* Lista de Clientes */}
          <View style={styles.containerShortClientList}>
            <ShortClientList />
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
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
  containerAdminButton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});
