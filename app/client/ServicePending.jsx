import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import PageHeader from '@/components/ui/PageHeader';
import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importando o componente de card de pendência
import ServicePendingCard from '@/components/ui/ServicePendingCard';

// Importando os dados simulados (em uma aplicação real, estes dados viriam de uma API)
import pendenciasData from '@/assets/mocks/pendenciasMock.json';

const ServicePending = () => {
  const [pendencias, setPendencias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simula uma chamada à API para buscar as pendências
  useEffect(() => {
    // Em uma aplicação real, aqui seria uma chamada à API
    const fetchPendencias = async () => {
      try {
        // Simulando um atraso de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        setPendencias(pendenciasData);
      } catch (error) {
        console.error('Erro ao buscar pendências:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendencias();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando pendências...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageHeader 
          title="Pendências de Serviço" 
          containerStyle={{backgroundColor: Colors.azulClaro}} 
          titleStyle={{color: '#fff'}}
      />

      {pendencias.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Você não possui pendências de serviço no momento.
          </Text>
        </View>
      ) : (
        <FlatList
          data={pendencias}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ServicePendingCard pendencia={item} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ServicePending;