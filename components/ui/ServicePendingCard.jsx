import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Componente de card para exibir pendências de serviço (apenas visualização)  ///////////////// SE DER CERTO ESSE AQUI É PRA SER EXCLUIDO
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.pendencia - Dados da pendência
 */
const ServicePendingCard = ({ pendencia }) => {
  const { veiculo, modelo, placa, descricao } = pendencia;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.veiculoContainer}>
          <Text style={styles.labelText}>Veículo:</Text>
          <Text style={styles.veiculoText}>{veiculo} - {modelo}</Text>
        </View>
        <View style={styles.placaContainer}>
          <Text style={styles.labelText}>Placa:</Text>
          <Text style={styles.placaText}>{placa}</Text>
        </View>
      </View>

      <View style={styles.descricaoContainer}>
        <Text style={styles.labelText}>Descrição:</Text>
        <Text style={styles.descricaoText}>{descricao}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  veiculoContainer: {
    flex: 2,
  },
  placaContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  labelText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  veiculoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  placaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  descricaoContainer: {
    marginTop: 8,
  },
  descricaoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default ServicePendingCard;
