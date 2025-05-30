/**
 * Tela de serviços pendentes para o CLIENTE
 * Essa tela só exibe os serviços pendentes relacionados aos veículos do cliente
*/

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Esse import precisa ser diferente para funcionar corretamente

// COMPONENTES 
import PageHeader from "@/components/PageHeader";
import ServiceCard from "@/components/ServiceCard";

// MOCKS
import mockServices from "@/assets/mocks/pendenciasMock.json"; 

// CORES
import Colors from "@/constants/Colors";

const servicePending = () => {
  const [services, setServices] = useState([]);

  // ID do cliente atual (em uma aplicação real, viria do contexto de autenticação)
  const clientId = "123";

  useEffect(() => {
    // Função para carregar os serviços do cliente
    const loadClientServices = () => {
      // Em uma aplicação real, você faria uma chamada à API para buscar
      // apenas os serviços do cliente logado
      const clientServices = mockServices.filter(
        (service) => service.clientId === clientId
      );

      setServices(clientServices);
    };

    loadClientServices();
  }, [clientId]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageHeader
        title="Meus Serviços Pendentes"
        containerStyle={{ backgroundColor: Colors.azulClaro }}
        titleStyle={{ color: "#fff" }}
      />
      <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        {services.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Você não possui serviços pendentes no momento.
            </Text>
          </View>
        ) : (
          <FlatList
            data={services}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ServiceCard
                service={item}
                isAdminView={false} // Não é visão de admin
                // Não precisamos passar as funções de ação para a visão do cliente
              />
            )}
            contentContainerStyle={styles.list}
          />
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  list: {
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default servicePending;
