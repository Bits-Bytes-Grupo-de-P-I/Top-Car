import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import ClientServiceCard from "@/components/ui/ClientServiceCard";
import PageHeader from "@/components/ui/PageHeader";

const clientServices = () => {
  // Dados de exemplo para o cliente
  const [meuServicos, setMeuServicos] = useState([
    {
      id: "1",
      clienteNome: "Meu Veículo", // Para o cliente, pode ser "Meu Veículo" ou o nome do próprio cliente
      veiculo: "Honda Civic",
      placa: "ABC1234",
      servico: "Troca de óleo",
      dataAgendada: "16/05/2025",
      status: "Finalizado",
      urgente: false,
      observacoes: "Serviço realizado com sucesso. Próxima troca recomendada em 10.000 km.",
    },
    {
      id: "2",
      clienteNome: "Meu Veículo",
      veiculo: "Toyota Corolla",
      placa: "XYZ5678",
      servico: "Revisão completa",
      dataAgendada: "17/05/2025",
      status: "Aguardando peça",
      urgente: true,
      observacoes: "Aguardando chegada da peça de reposição. Previsão: 2-3 dias úteis.",
    },
    {
      id: "3",
      clienteNome: "Meu Veículo",
      veiculo: "Volkswagen Golf",
      placa: "DEF9012",
      servico: "Troca de pastilhas de freio",
      dataAgendada: "18/05/2025",
      status: "Andamento",
      urgente: true,
      observacoes: "Serviço em andamento. Será finalizado ainda hoje.",
    },
  ]);

  const handleServicoPress = (item) => {
    console.log("Serviço visualizado:", item);
    // O modal já é aberto automaticamente pelo componente
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <PageHeader
          title="Meus Serviços"
          containerStyle={{ backgroundColor: Colors.azulClaro }}
          titleStyle={{ color: "#fff" }}
        />
        <ScrollView
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.listaContainer}>
            <View style={styles.infoContainer}>
              <FontAwesome6 
                name="info-circle" 
                size={16} 
                color={Colors.azulClaro} 
              />
              <Text style={styles.infoText}>
                Toque em um serviço para ver mais detalhes
              </Text>
            </View>

            {meuServicos.length > 0 ? (
              meuServicos.map((item) => (
                <ClientServiceCard
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
                <Text style={styles.emptySubText}>
                  Seus serviços aparecerão aqui quando forem agendados
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default clientServices;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  listaContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.grafite,
    flex: 1,
    fontFamily: "DM-Sans",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.grafite,
    textAlign: "center",
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.cinzaEscuro,
    textAlign: "center",
    lineHeight: 20,
  },
});