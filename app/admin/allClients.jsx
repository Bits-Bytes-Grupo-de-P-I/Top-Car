import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import PageHeader from "@/components/ui/PageHeader";

import Colors from "@/constants/Colors";

// Ícones
import Entypo from "@expo/vector-icons/Entypo";
import { FontAwesome5 } from "@expo/vector-icons";

// Componentes
// Importamos o componente AllClientsList que criamos especificamente para esta tela
import AllClientsList from "@/components/ui/AllClientsList";

export default function AllClients() {
  const router = useRouter();

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
          titleStyle={{ color: "#fff" }}
        />

        {/* Container conteudo */}
        <View style={styles.container}>
          {/* Container da lista de clientes - usando toda a altura disponível */}
          <View style={styles.containerClientList}>
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
  containerClientList: {
    flex: 1,
    width: "100%",
  },
});
