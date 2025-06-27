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
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
// COMPONENTES
import PageHeader from "@/components/PageHeader";
import ServiceCard from "@/components/ServiceCard";
// ÍCONES
import { FontAwesome6 } from "@expo/vector-icons";
// CORES
import Colors from "@/constants/Colors";

const API_BASE_URL = "https://topcar-back-end.onrender.com";

const servicePending = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [errorClientes, setErrorClientes] = useState(null);
  
  const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJqb2FvQGV4YW1wbGUuY29tIiwiZnVuY2FvIjoiYWRtaW4iLCJpYXQiOjE3NDg0NTQzODR9.3fxamj4FEzv265boICnC3WqcJZLiJ0Kfsmbpg9S9lFs"
  
  // Dados do cliente logado
  const [clienteLogado, setClienteLogado] = useState(null);

  // Função para buscar todas as pendências e filtrar pelo cliente
  const fetchPendencias = async () => {
    if (!clienteLogado || !clienteLogado.email) {
      console.log('Cliente logado ainda não definido');
      return;
    }

    if (clientes.length === 0) {
      console.log('Lista de clientes ainda não carregada');
      return;
    }

    // encontra o objeto cliente cujo email bate com o logado
    const clienteObj = clientes.find(c => c.email === clienteLogado.email);
    if (!clienteObj) {
      console.warn('Cliente logado não encontrado na lista de clientes');
      console.log('Email do cliente logado:', clienteLogado.email);
      console.log('Emails dos clientes:', clientes.map(c => c.email));
      setError('Cliente não encontrado na base de dados');
      setLoading(false);
      return;
    }
    
    const nomeDoCliente = clienteObj.nome;
    console.log('Nome do cliente encontrado:', nomeDoCliente);

    try {
      setLoading(true);
      setError(null);

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
      console.log('Todas as pendências:', data);

      // Filtra as pendências pelo nome do cliente
      const pendenciasDoCliente = data.filter(p => p.cliente === nomeDoCliente);
      console.log('Pendências filtradas do cliente:', pendenciasDoCliente);

      // Normaliza os dados para compatibilidade com o ServiceCard
      const normalizedServices = pendenciasDoCliente.map(pendencia => ({
        ...pendencia,
        // Campos para compatibilidade com ServiceCard
        vehicle: `${pendencia.veiculo} ${pendencia.modelo}`,
        licensePlate: pendencia.placa,
        description: pendencia.descricao,
        clienteName: pendencia.cliente,
        dataRegistro: formatarData(pendencia.data_registro)
      }));
      
      setServices(normalizedServices);
    } catch (error) {
      console.error('Erro ao buscar pendências:', error);
      setError(error.message);
      Alert.alert(
        "Erro",
        "Não foi possível carregar seus serviços pendentes. Tente novamente.",
        [
          { text: 'Tentar Novamente', onPress: fetchPendencias },
          { text: 'OK', style: 'cancel' }
        ]
      );
      // IMPORTANTE: Mesmo com erro, definir services como array vazio
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar todos os clientes
  const fetchClientes = async () => {
    try {
      setLoadingClientes(true);
      const res = await fetch(`${API_BASE_URL}/clientes`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setClientes(data);
      console.log('Clientes carregados:', data);
      
    } catch (e) {
      console.error('Erro ao buscar clientes:', e);
      setErrorClientes(e.message);
    } finally {
      setLoadingClientes(false);
    }
  };

  // Função para formatar data
  const formatarData = (dataString) => {
    if (!dataString) return "Data não informada";
    try {
      const data = new Date(dataString);
      if (isNaN(data.getTime())) return "Data inválida";
      return data.toLocaleDateString("pt-BR");
    } catch (error) {
      return "Data inválida";
    }
  };

  // Função para carregar dados do usuário logado
  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        setClienteLogado(user);
        console.log('Dados do cliente logado:', user);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    }
  };

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    loadUserData();
  }, []);

  // Carregar clientes ao montar o componente
  useEffect(() => {
    fetchClientes();
  }, []);

  // Carregar pendências quando os dados do usuário E a lista de clientes estiverem carregados
  useEffect(() => {
    if (clienteLogado && clientes.length > 0) {
      fetchPendencias();
    }
  }, [clienteLogado, clientes]);

  // Função para atualizar a lista (pull to refresh)
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPendencias();
    setRefreshing(false);
  };

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

        {loading && services.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.azulClaro} />
            <Text style={styles.loadingText}>Carregando serviços pendentes...</Text>
          </View>
        ) : error && services.length === 0 ? (
          <View style={styles.errorContainer}>
            <FontAwesome6
              name="exclamation-triangle"
              size={48}
              color={Colors.laranja}
            />
            <Text style={styles.errorText}>Erro ao carregar serviços</Text>
            <Text style={styles.errorSubText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchPendencias}
            >
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        ) : services.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome6
              name="clipboard-list"
              size={48}
              color={Colors.cinzaEscuro}
            />
            <Text style={styles.emptyText}>Nenhum serviço pendente</Text>
            <Text style={styles.emptySubText}>
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.grafite,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  errorText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.laranja,
    textAlign: "center",
  },
  errorSubText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.cinzaEscuro,
    textAlign: "center",
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: Colors.azulClaro,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
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