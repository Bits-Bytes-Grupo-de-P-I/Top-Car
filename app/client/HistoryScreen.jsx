import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import VehicleSelector from '@/components/ui/VehicleSelector';
import mockVehicles from '@/assets/mocks/mockVehicles.json';

import PageHeader from '@/components/ui/PageHeader';
import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const HistoryScreen = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleData, setVehicleData] = useState([]);
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);

  // Simulando o carregamento de dados do banco
  useEffect(() => {
    // Em uma aplicação real, você faria uma chamada API aqui
    setVehicleData(mockVehicles.vehicles);
  }, []);

  // Simula o carregamento do histórico de manutenção quando um veículo é selecionado
  useEffect(() => {
    if (selectedVehicle) {
      // Simula uma chamada à API para buscar o histórico de manutenção do veículo
      const mockHistory = [
        {
          id: 1,
          date: '2023-09-15',
          description: 'Troca de óleo e filtros',
          cost: 'R$ 350,00',
          mechanic: 'José Silva'
        },
        {
          id: 2,
          date: '2023-06-22',
          description: 'Alinhamento e balanceamento',
          cost: 'R$ 180,00',
          mechanic: 'Carlos Oliveira'
        },
        {
          id: 3,
          date: '2023-03-10',
          description: 'Revisão geral',
          cost: 'R$ 520,00',
          mechanic: 'José Silva'
        },
        {
          id: 4,
          date: '2022-12-05',
          description: 'Troca de pastilhas de freio',
          cost: 'R$ 280,00',
          mechanic: 'Marcos Santos'
        }
      ];
      
      setMaintenanceHistory(mockHistory);
    } else {
      setMaintenanceHistory([]);
    }
  }, [selectedVehicle]);

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    // Em uma aplicação real, você faria uma chamada API aqui para buscar o histórico do veículo
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <PageHeader 
          title="Serviços realizados" 
          containerStyle={{backgroundColor: Colors.azulClaro}} 
          titleStyle={{color: '#fff'}}
      /> 

      <ScrollView style={styles.container}>

        <Text style={styles.title}>Histórico de Manutenção</Text>
        
        {/* Componente de seleção de veículo */}
        <VehicleSelector
          vehicles={vehicleData}
          onVehicleSelect={handleVehicleSelect}
          initialVehicleId={null}
        />
        
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
            </View>

            {/* Histórico de manutenção */}
            <View style={styles.historyContainer}>
              <Text style={styles.sectionTitle}>Histórico de Serviços</Text>
              
              {maintenanceHistory.length > 0 ? (
                maintenanceHistory.map((item) => (
                  <View key={item.id} style={styles.historyItem}>
                    <View style={styles.historyHeader}>
                      <Text style={styles.historyDate}>{item.date}</Text>
                      <Text style={styles.historyCost}>{item.cost}</Text>
                    </View>
                    <Text style={styles.historyDescription}>{item.description}</Text>
                    <Text style={styles.historyMechanic}>Mecânico: {item.mechanic}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>
                  Nenhum registro de manutenção encontrado para este veículo.
                </Text>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              Selecione um veículo para visualizar seu histórico de manutenção
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  content: {
    marginTop: 16,
  },
  vehicleInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  historyContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  historyItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  historyCost: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  historyDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  historyMechanic: {
    fontSize: 14,
    color: '#666',
  },
  placeholderContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 16,
  },
});

export default HistoryScreen;