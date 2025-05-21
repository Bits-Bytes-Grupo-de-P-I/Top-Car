import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Componente de card de serviço para exibir serviços pendentes
 * 
 * @param {Object} props
 * @param {Object} props.service - Dados do serviço pendente
 * @param {boolean} props.isAdminView - Define se o card está sendo usado na visão de administrador
 * @param {Function} props.onEdit - Função para editar o serviço (apenas admin)
 * @param {Function} props.onDelete - Função para excluir o serviço (apenas admin)
 * @param {Function} props.onAccept - Função para marcar serviço como aceito (apenas admin)
 */

const ServiceCard = ({ 
  service, 
  isAdminView = false, 
  onEdit, 
  onDelete, 
  onAccept 
}) => {
  const handleEdit = () => {
    if (onEdit) onEdit(service.id);
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar exclusão",
      `Deseja realmente excluir o serviço pendente para o veículo ${service.vehicle}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => onDelete && onDelete(service.id), style: "destructive" }
      ]
    );
  };

  const handleAccept = () => {
    if (onAccept) onAccept(service.id);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.row}>
          <Text style={styles.label}>Veículo:</Text>
          <Text style={styles.value}>{service.vehicle}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Placa:</Text>
          <Text style={styles.value}>{service.licensePlate}</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.label}>Descrição:</Text>
          <Text style={styles.description}>{service.description}</Text>
        </View>

        {/* Botões de ação apenas para a visão de administrador */}
        {isAdminView && (
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={handleEdit}>
              <Ionicons name="pencil" size={18} color="#FFF" />
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
              <Ionicons name="trash" size={18} color="#FFF" />
              <Text style={styles.actionText}>Excluir</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                service.isAccepted ? styles.acceptedButton : styles.acceptButton
              ]} 
              onPress={handleAccept}
            >
              <Ionicons name={service.isAccepted ? "checkmark-circle" : "checkmark-circle-outline"} size={18} color={service.isAccepted ? '#fff' : '#2ecc71'} />
              <Text style={service.isAccepted ? styles.actionText : styles.acceptText}>{service.isAccepted ? "Aceito" : "Aceitar"}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 8,
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#444',
    flex: 1,
  },
  descriptionContainer: {
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#3498db',
    backgroundColor: '#3498db',
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#e74c3c',
    backgroundColor: '#e74c3c',
  },
  acceptButton: {
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  acceptText: {
    color: '#27ae60',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  acceptedButton: {
    borderWidth: 1,
    borderColor: '#27ae60',
    backgroundColor: '#27ae60',
  },
  actionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default ServiceCard;