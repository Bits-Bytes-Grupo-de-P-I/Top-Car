// Esse arquivo é responsável por exibir o histórico de serviços realizados nos veículos

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

// COMPONENTES
import VehicleSelector from "@/components/client/VehicleSelector";
import PageHeader from "@/components/PageHeader";

// ÍCONES
import { FontAwesome6 } from "@expo/vector-icons";

// CORES
import Colors from "@/constants/Colors";

// Configuração da API
const API_BASE_URL = "https://topcar-back-end.onrender.com";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJqb2FvQGV4YW1wbGUuY29tIiwiZnVuY2FvIjoiYWRtaW4iLCJpYXQiOjE3NDg0NTQzODR9.3fxamj4FEzv265boICnC3WqcJZLiJ0Kfsmbpg9S9lFs";

const serviceHistory = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleData, setVehicleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [oilChangeData, setOilChangeData] = useState(null);
  const [alignmentData, setAlignmentData] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [errorClientes, setErrorClientes] = useState(null);

  // Dados do cliente logado
  const [clienteLogado, setClienteLogado] = useState(null);

  // Função para buscar todos os clientes
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

  // Função para buscar veículos da API e filtrar pelo cliente logado
  const fetchVehicles = async () => {
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
    
    const idDoCliente = clienteObj.id;
    console.log('ID do cliente encontrado:', idDoCliente);

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/veiculos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const vehicles = await response.json();
      console.log('Todos os veículos:', vehicles);
      
      // Filtra os veículos pelo ID do cliente
      const veiculosDoCliente = vehicles.filter(v => v.cliente_id === idDoCliente);
      console.log('Veículos filtrados do cliente:', veiculosDoCliente);

      // Transformar os dados da API para o formato esperado pelo componente
      const formattedVehicles = veiculosDoCliente.map(vehicle => ({
        id: vehicle.id,
        name: `${vehicle.marca} ${vehicle.modelo}`,
        plate: vehicle.placa,
        year: vehicle.ano,
        color: vehicle.cor,
        lastMaintenance: vehicle.ultima_manutencao,
        km: vehicle.km,
        clientId: vehicle.cliente_id,
        // Dados originais para caso precise acessar
        originalData: vehicle
      }));

      setVehicleData(formattedVehicles);
    } catch (err) {
      console.error('Erro ao buscar veículos:', err);
      setError(err.message);
      Alert.alert(
        'Erro',
        'Não foi possível carregar os veículos. Verifique sua conexão e tente novamente.',
        [
          { text: 'OK' },
          { text: 'Tentar novamente', onPress: fetchVehicles }
        ]
      );
    } finally {
      setLoading(false);
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

  // Carregar veículos quando os dados do usuário E a lista de clientes estiverem carregados
  useEffect(() => {
    if (clienteLogado && clientes.length > 0) {
      fetchVehicles();
    }
  }, [clienteLogado, clientes]);

  // Simula o carregamento dos dados de serviços quando um veículo é selecionado
  useEffect(() => {
    if (selectedVehicle) {
      // Simula uma chamada à API para buscar os dados de troca de óleo
      const mockOilChange = {
        id: 1,
        date: "2023-09-15",
        kilometrage: selectedVehicle.km || "45.000",
        oilType: "Sintético 5W30",
        nextServices: {
          engineOil: "50.000",
          timingBelt: "90.000",
          oilFilter: "50.000",
          airFilter: "55.000",
        },
      };

      // Simula uma chamada à API para buscar os dados de alinhamento/balanceamento
      const mockAlignment = {
        id: 2,
        date: "2023-06-22",
        kilometrage: selectedVehicle.km ? (parseInt(selectedVehicle.km) - 2500).toString() : "42.500",
        nextRevision: selectedVehicle.km ? (parseInt(selectedVehicle.km) + 5000).toString() : "47.500",
      };

      setOilChangeData(mockOilChange);
      setAlignmentData(mockAlignment);
    } else {
      setOilChangeData(null);
      setAlignmentData(null);
    }
  }, [selectedVehicle]);

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageHeader
        title="Serviços realizados"
        containerStyle={{ backgroundColor: Colors.azulClaro }}
        titleStyle={{ color: "#fff" }}
      />

      <ScrollView style={styles.container}>
        {/* Componente de seleção de veículo */}
        <VehicleSelector
          vehicles={vehicleData}
          onVehicleSelect={handleVehicleSelect}
          initialVehicleId={null}
          loading={loading}
          error={error}
        />

        {/* Estados de loading e erro específicos */}
        {loading && vehicleData.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.azulClaro} />
            <Text style={styles.loadingText}>Carregando seus veículos...</Text>
          </View>
        ) : error && vehicleData.length === 0 ? (
          <View style={styles.errorContainer}>
            <FontAwesome6
              name="exclamation-triangle"
              size={48}
              color={Colors.laranja}
            />
            <Text style={styles.errorText}>Erro ao carregar veículos</Text>
            <Text style={styles.errorSubText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchVehicles}
            >
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        ) : vehicleData.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <FontAwesome6
              name="car"
              size={48}
              color={Colors.cinzaEscuro}
            />
            <Text style={styles.emptyText}>Nenhum veículo encontrado</Text>
            <Text style={styles.emptySubText}>
              Você ainda não possui veículos cadastrados.
            </Text>
          </View>
        ) : null}

        {/* Informações do veículo selecionado */}
        {selectedVehicle ? (
          <View style={styles.content}>
            <View style={styles.vehicleInfoCard}>
              <Text style={styles.sectionTitle}>Informações do Veículo</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Modelo:</Text>
                <Text style={styles.detailValue}>{selectedVehicle.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Placa:</Text>
                <Text style={styles.detailValue}>{selectedVehicle.plate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Ano:</Text>
                <Text style={styles.detailValue}>{selectedVehicle.year}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Cor:</Text>
                <Text style={styles.detailValue}>{selectedVehicle.color}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Quilometragem:</Text>
                <Text style={styles.detailValue}>{selectedVehicle.km} km</Text>
              </View>
            </View>

            {/* Cards de serviços */}
            <View style={styles.servicesContainer}>
              <Text style={styles.sectionTitleTwo}>Serviços Realizados</Text>

              {/* Card de Troca de Óleo */}
              {oilChangeData ? (
                <View style={styles.serviceCard}>
                  <View style={styles.serviceHeader}>
                    <Text style={styles.serviceTitle}>Troca de Óleo</Text>
                    <Text style={styles.serviceDate}>
                      Data: {oilChangeData.date}
                    </Text>
                  </View>

                  <View style={styles.serviceContent}>
                    <Text style={styles.serviceInfo}>
                      Trocado com {oilChangeData.kilometrage} km
                    </Text>
                    <Text style={styles.serviceInfo}>
                      Tipo do óleo: {oilChangeData.oilType}
                    </Text>
                  </View>

                  <View style={styles.nextServicesContainer}>
                    <Text style={styles.nextServicesTitle}>Próxima Troca:</Text>
                    <View style={styles.nextServiceItem}>
                      <Text style={styles.nextServiceLabel}>
                        Óleo do motor:
                      </Text>
                      <Text style={styles.nextServiceValue}>
                        {oilChangeData.nextServices.engineOil} km
                      </Text>
                    </View>
                    <View style={styles.nextServiceItem}>
                      <Text style={styles.nextServiceLabel}>
                        Correia dentada:
                      </Text>
                      <Text style={styles.nextServiceValue}>
                        {oilChangeData.nextServices.timingBelt} km
                      </Text>
                    </View>
                    <View style={styles.nextServiceItem}>
                      <Text style={styles.nextServiceLabel}>
                        Filtro do óleo:
                      </Text>
                      <Text style={styles.nextServiceValue}>
                        {oilChangeData.nextServices.oilFilter} km
                      </Text>
                    </View>
                    <View style={styles.nextServiceItem}>
                      <Text style={styles.nextServiceLabel}>Filtro de ar:</Text>
                      <Text style={styles.nextServiceValue}>
                        {oilChangeData.nextServices.airFilter} km
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}

              {/* Card de Alinhamento/Balanceamento */}
              {alignmentData ? (
                <View style={styles.serviceCard}>
                  <View style={styles.serviceHeader}>
                    <Text style={styles.serviceTitle}>
                      Alinhamento/Balanceamento
                    </Text>
                    <Text style={styles.serviceDate}>
                      Data: {alignmentData.date}
                    </Text>
                  </View>

                  <View style={styles.serviceContent}>
                    <Text style={styles.serviceInfo}>
                      Revisado com {alignmentData.kilometrage} km
                    </Text>
                  </View>

                  <View style={styles.nextServicesContainer}>
                    <Text style={styles.nextServicesTitle}>
                      Próxima Revisão:
                    </Text>
                    <View style={styles.nextServiceItem}>
                      <Text style={styles.nextServiceValue}>
                        {alignmentData.nextRevision} km
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}

              {!oilChangeData && !alignmentData && (
                <Text style={styles.emptyText}>
                  Nenhum registro de serviço encontrado para este veículo.
                </Text>
              )}
            </View>
          </View>
        ) : (
          !loading && !error && vehicleData.length > 0 && (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>
                Selecione um veículo para visualizar seus serviços realizados
              </Text>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
  },
  content: {
    marginTop: 16,
  },
  vehicleInfoCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  sectionTitleTwo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
  },
  servicesContainer: {
    marginBottom: 16,
  },
  serviceCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  serviceHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 12,
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  serviceDate: {
    fontSize: 14,
    color: "#666",
  },
  serviceContent: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 12,
  },
  serviceInfo: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  nextServicesContainer: {
    paddingTop: 8,
  },
  nextServicesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  nextServiceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  nextServiceLabel: {
    fontSize: 15,
    color: "#666",
  },
  nextServiceValue: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  placeholderContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    padding: 16,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "white",
    borderRadius: 12,
    marginTop: 16,
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
    marginTop: 16,
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
    marginTop: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default serviceHistory;