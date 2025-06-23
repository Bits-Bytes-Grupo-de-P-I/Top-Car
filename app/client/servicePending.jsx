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
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// COMPONENTES
import PageHeader from "@/components/PageHeader";
import ServiceCard from "@/components/ServiceCard";
// CORES
import Colors from "@/constants/Colors";

const API_BASE_URL = "https://topcar-back-end.onrender.com";

const servicePending = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Token de autenticação do cliente
  // Em uma aplicação real, isso viria do contexto de autenticação
  const authToken = "SEU_TOKEN_DO_CLIENTE_AQUI";
  
  // ID do cliente atual (em uma aplicação real, viria do contexto de autenticação ou do token decodificado)
  const clientId = 4; // Substitua pelo ID real do cliente logado

  useEffect(() => {
    loadClientServices();
  }, []);

  /**
   * Lista todas as pendências e filtra apenas as do cliente atual
   * @returns {Promise<Array>} Array com as pendências do cliente
   */
  const getClientPendencias = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pendencias`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar pendências: ${response.status}`);
      }

      const data = await response.json();
      
      // Filtra apenas as pendências do cliente atual
      // Como o backend retorna com JOIN, podemos filtrar por cliente_id se estiver disponível
      // ou por nome do cliente se necessário
      const clientPendencias = data.filter(pendencia => {
        // Se o backend retornar cliente_id, use isso:
        // return pendencia.cliente_id === clientId;
        
        // Por enquanto, como não temos cliente_id na resposta do GET,
        // vamos assumir que precisamos de um endpoint específico
        // ou modificar o backend para incluir cliente_id
        return true; // Temporário - retorna todas até ajustar o backend
      });
      
      return clientPendencias;
    } catch (error) {
      console.error('Erro ao listar pendências do cliente:', error);
      throw error;
    }
  };

  /**
   * Alternativa: Buscar pendências de um cliente específico
   * (Requer criação de endpoint no backend: GET /clientes/:id/pendencias)
   * // É AQUI QUE VOCÊ VAI MEXER DEPOIS DE CRIAR O LOGIN, BERNARDO
   */
  const getClientPendenciasById = async (clienteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${clienteId}/pendencias`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return []; // Cliente não tem pendências
        }
        throw new Error(`Erro ao buscar pendências do cliente: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao listar pendências do cliente:', error);
      if (error.message.includes('404')) {
        return []; // Retorna array vazio se não encontrar
      }
      throw error;
    }
  };

  // Função para carregar os serviços do cliente
  const loadClientServices = async () => {
    try {
      setLoading(true);
      
      // Tenta primeiro usar o endpoint específico do cliente (se existir)
      let pendencias;
      try {
        pendencias = await getClientPendenciasById(clientId);
      } catch (error) {
        // Se não existir o endpoint específico, usa o método geral
        console.log('Endpoint específico não disponível, usando método geral...');
        pendencias = await getClientPendencias();
      }
      
      // Normaliza os dados para compatibilidade com o ServiceCard
      const normalizedServices = pendencias.map(pendencia => ({
        ...pendencia,
        // Campos para compatibilidade com ServiceCard
        vehicle: `${pendencia.veiculo} ${pendencia.modelo}`,
        licensePlate: pendencia.placa,
        description: pendencia.descricao,
        clienteName: pendencia.cliente
      }));
      
      setServices(normalizedServices);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível carregar seus serviços pendentes. Tente novamente."
      );
      console.error("Erro ao carregar serviços do cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar a lista (pull to refresh)
  const onRefresh = async () => {
    setRefreshing(true);
    await loadClientServices();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <PageHeader
          title="Meus Serviços Pendentes"
          containerStyle={{ backgroundColor: Colors.azulClaro }}
          titleStyle={{ color: "#fff" }}
        />
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={Colors.azulClaro} />
          <Text style={[styles.emptyStateText, { marginTop: 10 }]}>
            Carregando seus serviços...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <PageHeader
          title="Meus Serviços Pendentes"
          containerStyle={{ backgroundColor: Colors.azulClaro }}
          titleStyle={{ color: "#fff" }}
        />
        
        {services?.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Você não possui serviços pendentes no momento.
            </Text>
          </View>
        ) : (
          <FlatList
            data={services}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ServiceCard
                service={item}
                isAdminView={false} // Não é visão de admin
                // Não precisamos passar as funções de ação para a visão do cliente
              />
            )}
            contentContainerStyle={styles.list}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default servicePending;

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
