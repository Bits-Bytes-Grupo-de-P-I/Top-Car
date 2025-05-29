import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const VehicleSelector = ({ 
  onVehicleSelect, 
  initialVehicleId = null,
  vehicles = []
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Encontrar o veículo inicial se houver um ID inicial fornecido
    if (initialVehicleId && vehicles.length > 0) {
      const initialVehicle = vehicles.find(vehicle => vehicle.id === initialVehicleId);
      if (initialVehicle) {
        setSelectedVehicle(initialVehicle);
      }
    }
  }, [initialVehicleId, vehicles]);

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModalVisible(false);
    
    // Notificar o componente pai da mudança
    if (onVehicleSelect) {
      onVehicleSelect(vehicle);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.vehicleSelector} 
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.vehicleInfo}>
          <MaterialIcons name="directions-car" size={24} color="#007AFF" style={styles.icon} />
          
          {selectedVehicle ? (
            <View style={styles.selectedVehicleInfo}>
              <Text style={styles.vehicleName}>{selectedVehicle.name}</Text>
              <Text style={styles.vehiclePlate}>{selectedVehicle.plate}</Text>
            </View>
          ) : (
            <Text style={styles.placeholderText}>Selecione um veículo</Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.selectButton} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.selectButtonText}>Selecionar</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione um Veículo</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {vehicles.length > 0 ? (
              <FlatList
                data={vehicles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[
                      styles.vehicleItem,
                      selectedVehicle?.id === item.id && styles.selectedVehicleItem
                    ]}
                    onPress={() => handleVehicleSelect(item)}
                  >
                    <View style={styles.vehicleItemInfo}>
                      <Text style={styles.vehicleItemName}>{item.name}</Text>
                      <Text style={styles.vehicleItemPlate}>{item.plate}</Text>
                    </View>
                    {selectedVehicle?.id === item.id && (
                      <View style={styles.selectedIndicator} />
                    )}
                  </TouchableOpacity>
                )}
                style={styles.vehicleList}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum veículo cadastrado</Text>
                <TouchableOpacity 
                  style={styles.addVehicleButton}
                  onPress={() => {
                    setModalVisible(false);
                    router.push('/vehicles/new');
                  }}
                >
                  <Text style={styles.addVehicleButtonText}>Cadastrar Veículo</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  vehicleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  selectedVehicleInfo: {
    flexDirection: 'column',
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  vehiclePlate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  selectButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  vehicleList: {
    maxHeight: 400,
  },
  vehicleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  vehicleItemInfo: {
    flexDirection: 'column',
  },
  vehicleItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  vehicleItemPlate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  selectedVehicleItem: {
    backgroundColor: '#f0f9ff',
  },
  selectedIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  addVehicleButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addVehicleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default VehicleSelector;