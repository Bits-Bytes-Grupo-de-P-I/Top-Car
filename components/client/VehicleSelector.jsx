import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const VehicleSelector = ({ 
  onVehicleSelect, 
  initialVehicleId = null,
  vehicles = [],
  loading = false,
  error = null
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const renderModalContent = () => {
    if (loading) {
      return (
        <View style={styles.messageContainer}>
          <MaterialIcons name="hourglass-empty" size={32} color="#666" />
          <Text style={styles.messageText}>Carregando veículos...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.messageContainer}>
          <MaterialIcons name="error-outline" size={32} color="#d32f2f" />
          <Text style={styles.errorText}>Erro ao carregar veículos</Text>
          <Text style={styles.errorSubText}>{error}</Text>
        </View>
      );
    }

    if (vehicles.length === 0) {
      return (
        <View style={styles.messageContainer}>
          <MaterialIcons name="directions-car" size={32} color="#666" />
          <Text style={styles.messageText}>Nenhum veículo cadastrado</Text>
        </View>
      );
    }

    return (
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
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.vehicleSelector} 
        onPress={() => setModalVisible(true)}
        disabled={loading}
      >
        <View style={styles.vehicleInfo}>
          <MaterialIcons name="directions-car" size={24} color="#007AFF" style={styles.icon} />
          
          {selectedVehicle ? (
            <View style={styles.selectedVehicleInfo}>
              <Text style={styles.vehicleName}>{selectedVehicle.name}</Text>
              <Text style={styles.vehiclePlate}>{selectedVehicle.plate}</Text>
            </View>
          ) : (
            <Text style={styles.placeholderText}>
              {loading ? "Carregando..." : "Selecione um veículo"}
            </Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.selectButton, loading && styles.selectButtonDisabled]} 
          onPress={() => setModalVisible(true)}
          disabled={loading}
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

            {renderModalContent()}
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
  selectButtonDisabled: {
    backgroundColor: '#ccc',
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
  messageContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default VehicleSelector;