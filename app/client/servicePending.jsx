// Tela de serviços pendentes para o CLIENTE
// Essa tela só exibe os serviços pendentes relacionados aos veículos do cliente
import React, { useState, useEffect } from "react";
import { useAuthContext } from '@/hooks/useAuth';
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
  
  const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJqb2FvQGV4YW1wbGUuY29tIiwiZnVuY2FvIjoiYWRtaW4iLCJpYXQiOjE3NDg0NTQzODR9.3fxamj4FEzv265boICnC3WqcJZLiJ0Kfsmbpg9S9lFs"
  
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

  const getClientPendenciasById = async () => {
    try {
      const response = await fetch("https://topcar-back-end.onrender.com/pendencias/do-cliente", {
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
      // IMPORTANTE: Mesmo com erro, definir services como array vazio
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

// DADOS MOCKADOS PARA TESTE
//   const loadClientServices = async () => {
//   setLoading(true);
//   // Dados de teste
//   setServices([
//     {
//       id: 1,
//       cliente: "João Silva",
//       veiculo: "Honda",
//       modelo: "Civic",
//       placa: "ABC-1234",
//       descricao: "Troca de óleo",
//       data_registro: "2024-01-15"
//     }
//   ]);
//   setLoading(false);
// };

  // Função para atualizar a lista (pull to refresh)
  const onRefresh = async () => {
    setRefreshing(true);
    await loadClientServices();
    setRefreshing(false);
  };

  // Estado de loading
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
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
    <SafeAreaView style={styles.container}>
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
        
        {services.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Você não possui serviços pendentes no momento.
            </Text>
          </View>
        ) : (
          <FlatList
            data={services}
            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
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
            style={styles.flatList}
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
  background: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  list: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexGrow: 1,
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