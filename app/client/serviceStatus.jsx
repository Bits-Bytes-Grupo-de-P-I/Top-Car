import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
// COMPONENTES
import PageHeader from "@/components/PageHeader";
import ClientServiceCard from "@/components/client/ClientServiceCard";
// ÍCONES
import { FontAwesome6 } from "@expo/vector-icons";
// CORES
import Colors from "@/constants/Colors";

const ServiceStatus = () => {
  const [meuServicos, setMeuServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [errorClientes, setErrorClientes] = useState(null);

  // Configurações da API
  const API_BASE_URL = "https://topcar-back-end.onrender.com";
  const AUTH_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJqb2FvQGV4YW1wbGUuY29tIiwiZnVuY2FvIjoiYWRtaW4iLCJpYXQiOjE3NDg0NTQzODR9.3fxamj4FEzv265boICnC3WqcJZLiJ0Kfsmbpg9S9lFs";

  // Dados do cliente logado (mudança aqui: agora é um objeto)
  const [clienteLogado, setClienteLogado] = useState(null);

  // busca os pedidos e filtra por "nome do cliente" extraído do clienteLogado.email
  const fetchPedidos = async () => {
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

      const res = await fetch(`${API_BASE_URL}/pedidos`, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`
        }
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log('Todos os pedidos:', data);

      // filtra pelo nome correto
      const pedidosDoCliente = data.filter(p => p.nome === nomeDoCliente);
      console.log('Pedidos filtrados do cliente:', pedidosDoCliente);

      const servicosFormatados = pedidosDoCliente.map(p => ({
        id: p.id,
        clienteNome: p.nome,
        telefone: p.telefone,
        veiculo: `${p.modelo} ${p.ano}`,
        placa: p.placa,
        servico: p.resumo,
        observacoes: p.descricao,
        dataAgendada: formatarData(p.dataPedido),
        status: mapearStatus(p.status),
        urgente: p.status === 'urgente'
      }));

      setMeuServicos(servicosFormatados);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      setError(err.message);
      Alert.alert(
        'Erro',
        'Não foi possível carregar os serviços. Tente novamente.',
        [
          { text: 'Tentar Novamente', onPress: fetchPedidos },
          { text: 'OK', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      setLoadingClientes(true);
      const res = await fetch(`${API_BASE_URL}/clientes`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
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

  // Função para mapear status do backend para o formato do frontend
  const mapearStatus = (status) => {
    const statusMap = {
      pendente: "Aguardando",
      em_andamento: "Andamento",
      aguardando_peca: "Aguardando peça",
      concluido: "Concluído",
      finalizado: "Concluído",
    };
    return statusMap[status?.toLowerCase()] || status || "Pendente";
  };

  // Função para carregar dados do usuário logado
  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        // Mudança aqui: mantém o objeto completo
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

  // Carregar clientes ao montar o componente (removido a duplicação)
  useEffect(() => {
    fetchClientes();
  }, []);

  // Carregar pedidos quando os dados do usuário E a lista de clientes estiverem carregados
  useEffect(() => {
    if (clienteLogado && clientes.length > 0) {
      fetchPedidos();
    }
  }, [clienteLogado, clientes]); // Dependência corrigida

  const handleServicoPress = (item) => {
    console.log("Serviço visualizado:", item);
    // O modal já é aberto automaticamente pelo componente
  };

  // Função para recarregar dados (pull to refresh)
  const handleRefresh = () => {
    fetchPedidos();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <PageHeader
          title="Meus Serviços em andamento"
          containerStyle={{ backgroundColor: Colors.azulClaro }}
          titleStyle={{ color: "#fff" }}
        />

        <ScrollView
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            // Opcional: adicionar pull to refresh
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              tintColor={Colors.azulClaro}
            />
          }
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

            {loading && meuServicos.length === 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.azulClaro} />
                <Text style={styles.loadingText}>Carregando serviços...</Text>
              </View>
            ) : error && meuServicos.length === 0 ? (
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
                  onPress={fetchPedidos}
                >
                  <Text style={styles.retryButtonText}>Tentar Novamente</Text>
                </TouchableOpacity>
              </View>
            ) : meuServicos?.length > 0 ? (
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

export default ServiceStatus;

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
  loadingContainer: {
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.grafite,
    textAlign: "center",
  },
  errorContainer: {
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