import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; //import para concertar a tela no celular
import React, { useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CardServico from "@/components/ui/CardServico";
import PageHeader from "@/components/ui/PageHeader";
import Emergency from "@/components/ui/Emergency";

const ongoingServices = () => {
  // Dados de exemplo
  const [servicos, setServicos] = useState([
    {
      id: "1",
      clienteNome: "João Silva",
      veiculo: "Honda Civic",
      placa: "ABC1234",
      servico: "Troca de óleo",
      dataAgendada: "16/05/2025",
      status: "Finalizado",
      urgente: false,
    },
    {
      id: "2",
      clienteNome: "Maria Oliveira",
      veiculo: "Toyota Corolla",
      placa: "XYZ5678",
      servico: "Revisão completa",
      dataAgendada: "17/05/2025",
      status: "Aguardando peça",
      urgente: true,
    },
    {
      id: "3",
      clienteNome: "Carlos Pereira",
      veiculo: "Volkswagen Golf",
      placa: "DEF9012",
      servico: "Troca de pastilhas de freio",
      dataAgendada: "18/05/2025",
      status: "Andamento",
      urgente: false,
    },
  ]);

  const handleServicoPress = (item) => {
    console.log("Serviço selecionado:", item);
    // Navegação para detalhes do serviço
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ImageBackground
      source={require("@/assets/images/fundo.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <PageHeader
        title="Serviços em Andamento"
        containerStyle={{ backgroundColor: Colors.azulClaro }}
        titleStyle={{ color: "#fff" }}
      />

      <ScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.listaContainer}>
          {servicos.length > 0 ? (
            servicos.map((item) => (
              <CardServico
                key={item.id}
                item={item}
                onPress={handleServicoPress}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <FontAwesome6
                name="clipboard-list"
                size={48}
                color={Colors.cinzaEscuro}
              />
              <Text style={styles.emptyText}>Nenhum serviço encontrado</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
    </SafeAreaView>
  );
};

export default ongoingServices;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  filtrosContainer: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: Colors.cinzaClaro,
  },
  filtroItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: Colors.cinzaClaro,
  },
  filtroItemAtivo: {
    backgroundColor: Colors.azulClaro,
  },
  filtroTexto: {
    fontSize: 14,
    color: Colors.cinzaEscuro,
  },
  filtroTextoAtivo: {
    color: "white",
    fontWeight: "bold",
  },
  listaContainer: {
    padding: 16,
    paddingBottom: 80, // Espaço para o botão flutuante
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.cinzaEscuro,
    textAlign: "center",
  },
  ButtonAdicionar: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.azulClaro,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
