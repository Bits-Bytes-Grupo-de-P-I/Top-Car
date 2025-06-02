// Tela para a visualização da lista de todos os clientes cadastrados

import { View, StyleSheet, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// COMPONENTES
import PageHeader from "@/components/PageHeader";
import AllClientsList from "@/components/admin/AllClientsList";

// CORES
import Colors from "@/constants/Colors";

export default function AllClients() {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <PageHeader
          title="Todos os Clientes"
          containerStyle={{ backgroundColor: Colors.azulClaro }}
          titleStyle={{ color: "white" }}
        />

        {/* Container conteudo */}
        <View style={styles.container}>
          {/* Container da lista de clientes */}
          <View style={styles.containerShortClientList}>
            <AllClientsList />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 30,
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
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontFamily: "DM-Sans",
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "white",
  },
  containerTitulo: {
    width: "100%",
    alignItems: "center",
    marginVertical: 25,
  },
  titulo: {
    fontSize: 24,
    fontFamily: "DM-Sans",
    fontWeight: "bold",
    color: Colors.azulClaro,
  },
  containerShortClientList: {
    flex: 1,
    width: "100%",
  },
});
