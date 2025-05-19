import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import VehicleSelector from '@/components/ui/VehicleSelector';
import mockVehicles from '@/assets/mocks/mockVehicles.json';

import PageHeader from '@/components/ui/PageHeader';
import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const HistoryScreen = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleData, setVehicleData] = useState([]);
  const [oilChangeData, setOilChangeData] = useState(null);
  const [alignmentData, setAlignmentData] = useState(null);

  // Simulando o carregamento de dados do banco
  useEffect(() => {
    // Em uma aplicação real, você faria uma chamada API aqui
    setVehicleData(mockVehicles.vehicles);
  }, []);

  // Simula o carregamento dos dados de serviços quando um veículo é selecionado
  useEffect(() => {
    if (selectedVehicle) {
      // Simula uma chamada à API para buscar os dados de troca de óleo
      const mockOilChange = {
        id: 1,
        date: '2023-09-15',
        kilometrage: '45.000',
        oilType: 'Sintético 5W30',
        nextServices: {
          engineOil: '50.000',
          timingBelt: '90.000',
          oilFilter: '50.000',
          airFilter: '55.000'
        }
      };
      
      // Simula uma chamada à API para buscar os dados de alinhamento/balanceamento
      const mockAlignment = {
        id: 2,
        date: '2023-06-22',
        kilometrage: '42.500',
        nextRevision: '47.500'
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
    // Em uma aplicação real, você faria chamadas API aqui para buscar os dados de serviço do veículo
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      > */}
      <PageHeader 
          title="Serviços realizados" 
          containerStyle={{backgroundColor: Colors.azulClaro}} 
          titleStyle={{color: '#fff'}}
      /> 

      <ScrollView style={styles.container}>
        {/* <Text style={styles.title}>Histórico de Manutenção</Text> */}
        
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

            {/* Cards de serviços */}
            <View style={styles.servicesContainer}>
              <Text style={styles.sectionTitleTwo}>Serviços Realizados</Text>
              
              {/* Card de Troca de Óleo */}
              {oilChangeData ? (
                <View style={styles.serviceCard}>
                  <View style={styles.serviceHeader}>
                    <Text style={styles.serviceTitle}>Troca de Óleo</Text>
                    <Text style={styles.serviceDate}>Data: {oilChangeData.date}</Text>
                  </View>
                  
                  <View style={styles.serviceContent}>
                    <Text style={styles.serviceInfo}>Trocado com {oilChangeData.kilometrage} km</Text>
                    <Text style={styles.serviceInfo}>Tipo do óleo: {oilChangeData.oilType}</Text>
                  </View>
                  
                  <View style={styles.nextServicesContainer}>
                    <Text style={styles.nextServicesTitle}>Próxima Troca:</Text>
                    <View style={styles.nextServiceItem}>
                      <Text style={styles.nextServiceLabel}>Óleo do motor:</Text>
                      <Text style={styles.nextServiceValue}>{oilChangeData.nextServices.engineOil} km</Text>
                    </View>
                    <View style={styles.nextServiceItem}>
                      <Text style={styles.nextServiceLabel}>Correia dentada:</Text>
                      <Text style={styles.nextServiceValue}>{oilChangeData.nextServices.timingBelt} km</Text>
                    </View>
                    <View style={styles.nextServiceItem}>
                      <Text style={styles.nextServiceLabel}>Filtro do óleo:</Text>
                      <Text style={styles.nextServiceValue}>{oilChangeData.nextServices.oilFilter} km</Text>
                    </View>
                    <View style={styles.nextServiceItem}>
                      <Text style={styles.nextServiceLabel}>Filtro de ar:</Text>
                      <Text style={styles.nextServiceValue}>{oilChangeData.nextServices.airFilter} km</Text>
                    </View>
                  </View>
                </View>
              ) : null}
              
              {/* Card de Alinhamento/Balanceamento */}
              {alignmentData ? (
                <View style={styles.serviceCard}>
                  <View style={styles.serviceHeader}>
                    <Text style={styles.serviceTitle}>Alinhamento/Balanceamento</Text>
                    <Text style={styles.serviceDate}>Data: {alignmentData.date}</Text>
                  </View>
                  
                  <View style={styles.serviceContent}>
                    <Text style={styles.serviceInfo}>Revisado com {alignmentData.kilometrage} km</Text>
                  </View>
                  
                  <View style={styles.nextServicesContainer}>
                    <Text style={styles.nextServicesTitle}>Próxima Revisão:</Text>
                    <View style={styles.nextServiceItem}>
                      <Text style={styles.nextServiceValue}>{alignmentData.nextRevision} km</Text>
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
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              Selecione um veículo para visualizar seus serviços realizados
            </Text>
          </View>
        )}
      </ScrollView>
      {/* </ImageBackground> */}
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

  sectionTitleTwo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
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
  servicesContainer: {
    marginBottom: 16,
  },
  serviceCard: {
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
  serviceHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  serviceDate: {
    fontSize: 14,
    color: '#666',
  },
  serviceContent: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 12,
  },
  serviceInfo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  nextServicesContainer: {
    paddingTop: 8,
  },
  nextServicesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  nextServiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  nextServiceLabel: {
    fontSize: 15,
    color: '#666',
  },
  nextServiceValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
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