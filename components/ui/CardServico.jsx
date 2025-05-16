import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Emergencia from './Emergencia';

const CardServico = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.servicoItem,
        item.urgente ? styles.servicoUrgente : {}
      ]}
      onPress={() => onPress(item)}
    >
      <View style={styles.servicoHeader}>
        <Text style={styles.clienteNome}>{item.clienteNome}</Text>
        {item.urgente && (
          <View style={styles.urgenteBadge}>
            <Emergencia/>
          </View>
        )}
      </View>
     
      <View style={styles.servicoInfo}>
        <View style={styles.infoRow}>
          <FontAwesome6 name="car" size={14} color={Colors.azulClaro} />
          <Text style={styles.infoText}>{item.veiculo} - {item.placa}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome6 name="wrench" size={14} color={Colors.azulClaro} />
          <Text style={styles.infoText}>{item.servico}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome6 name="calendar" size={14} color={Colors.azulClaro} />
          <Text style={styles.infoText}>{item.dataAgendada}</Text>
        </View>
      </View>
     
      <View style={styles.statusContainer}>
        <Text style={[
          styles.statusText,
          item.status === 'Finalizado' ? styles.statusFinalizado :
          item.status === 'Aguardando peça' ? styles.statusAguardandoPeca :
          styles.statusAndamento
        ]}>
          {item.status}
        </Text>
        <FontAwesome6 name="chevron-right" size={16} color={Colors.cinzaEscuro} />
      </View>
    </TouchableOpacity>
  );
};

export default CardServico;

const styles = StyleSheet.create({
  servicoItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  servicoUrgente: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.laranja,
  },
  servicoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  clienteNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.azulClaro,
  },
  urgenteBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  urgenteText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  servicoInfo: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.cinzaEscuro,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.cinzaClaro,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  statusFinalizado: {
    color: Colors.verde,
  },
  statusAndamento: {
    color: Colors.azulClaro,
  },
  statusAguardandoPeca: {
    color: Colors.laranja,
  },
});
