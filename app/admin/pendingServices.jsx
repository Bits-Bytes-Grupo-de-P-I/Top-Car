import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "@/components/PageHeader";
import Colors from "@/constants/Colors";

import ServiceCard from "@/components/ServiceCard"; //componente de card de serviços pendentes
import mockServices from "@/assets/mocks/pendenciasMock.json"; // Mock de serviços pendentes

/**
 * Tela de serviços pendentes para o ADMINISTRADOR
 * Essa tela exibe todos os serviços pendentes e permite gerenciá-los
 */

const pendingServices = () => {
  const [services, setServices] = useState([]);

  // ID do administrador atual (em uma aplicação real, viria do contexto de autenticação)
  const adminId = "456";

  useEffect(() => {
    // Função para carregar todos os serviços
    const loadAllServices = () => {
      // Em uma aplicação real, você faria uma chamada à API
      // e possivelmente filtraria pelos serviços criados por este admin específico
      // const adminServices = mockServices.filter(
      //   service => service.createdBy === `admin${adminId}`
      // );

      // Neste exemplo, estamos mostrando todos os serviços para o admin
      setServices(mockServices);
    };

    loadAllServices();
  }, [adminId]);

  // Manipuladores de eventos para ações do administrador
  const handleEditService = (serviceId) => {
    console.log(`Editar serviço ID: ${serviceId}`);
    // Aqui você navegaria para uma tela de edição ou abriria um modal
    // navigate(`/service/edit/${serviceId}`);
  };

  const handleDeleteService = (serviceId) => {
    console.log(`Excluir serviço ID: ${serviceId}`);
    // Aqui você removeria o serviço da lista e faria uma chamada à API
    setServices(services.filter((service) => service.id !== serviceId));
    // Em produção você faria algo como: deleteServiceAPI(serviceId)
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageHeader
        title="Serviços em Pendência"
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
              Não há serviços pendentes cadastrados.
            </Text>
          </View>
        ) : (
          <FlatList
            data={services}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ServiceCard
                service={item}
                isAdminView={true} // É visão de admin
                onEdit={handleEditService}
                onDelete={handleDeleteService}
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

export default pendingServices;
