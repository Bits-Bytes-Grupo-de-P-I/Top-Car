import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import Colors from "@/constants/Colors";

// Ícones
import Entypo from "@expo/vector-icons/Entypo";

// Componentes
import Card from "@/components/ui/Card";
import ClientList from "@/components/ui/ClientList";
import BackToHomeButton from "@/components/ui/BackToHomeButton";

export default function Index() {
  const router = useRouter();
  
  // Dados para o FlatList
  const sections = [
    { 
      type: 'title', 
      data: { text: 'início' } 
    },
    { 
      type: 'adminButton', 
      data: {} 
    },
    { 
      type: 'cards', 
      data: {} 
    },
    { 
      type: 'title', 
      data: { text: 'Clientes' } 
    },
    { 
      type: 'clientList', 
      data: {} 
    },
  ];
  
  // Renderizar cada tipo de seção
  const renderItem = ({ item }) => {
    switch (item.type) {
      case 'title':
        return (
          <View style={styles.containerTitulo}>
            <Text style={styles.titulo}>{item.data.text}</Text>
          </View>
        );
        
      case 'adminButton':
        return (
          <View style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}>
            <Text>Página do administrador</Text>
            <BackToHomeButton />
          </View>
        );
        
      case 'cards':
        return (
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
        );
        
      case 'clientList':
        return (
          <View style={styles.containerClientList}>
            <ClientList />
          </View>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Barra do topo (fora da FlatList) */}
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
        
        {/* Container principal - usando FlatList em vez de ScrollView */}
        <FlatList
          data={sections}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={true}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  listContainer: {
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
});