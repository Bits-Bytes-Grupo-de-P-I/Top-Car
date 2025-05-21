// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList } from 'react-native';
// import { useRouter } from 'expo-router';
// import PageHeader from '@/components/ui/PageHeader';
// import Colors from '@/constants/Colors';
// import { SafeAreaView } from 'react-native-safe-area-context';

// // Importando o componente de card de pendência
// import ServicePendingCard from '@/components/ui/ServicePendingCard';

// // Importando os dados simulados (em uma aplicação real, estes dados viriam de uma API)
// import pendenciasData from '@/assets/mocks/pendenciasMock.json';

// const ServicePending = () => {
//   const [pendencias, setPendencias] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Simula uma chamada à API para buscar as pendências
//   useEffect(() => {
//     // Em uma aplicação real, aqui seria uma chamada à API
//     const fetchPendencias = async () => {
//       try {
//         // Simulando um atraso de rede
//         await new Promise(resolve => setTimeout(resolve, 500));
//         setPendencias(pendenciasData);
//       } catch (error) {
//         console.error('Erro ao buscar pendências:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPendencias();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text>Carregando pendências...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <PageHeader 
//           title="Pendências de Serviço" 
//           containerStyle={{backgroundColor: Colors.azulClaro}} 
//           titleStyle={{color: '#fff'}}
//       />

//       {pendencias.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Text style={styles.emptyText}>
//             Você não possui pendências de serviço no momento.
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={pendencias}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <ServicePendingCard pendencia={item} />
//           )}
//           contentContainerStyle={styles.listContent}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     padding: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContent: {
//     paddingVertical: 8,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//   },
// });

// export default ServicePending;

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageHeader from '@/components/ui/PageHeader';
import Colors from '@/constants/Colors';

import ServiceCard from '@/components/ui/ServiceCard'; //componente de card de serviços pendentes
import mockServices from '@/assets/mocks/pendenciasMock.json'; // Mock de serviços pendentes

/**
 * Tela de serviços pendentes para o CLIENTE
 * Essa tela só exibe os serviços pendentes relacionados aos veículos do cliente
 */

const ServicePending = () => {
  const [services, setServices] = useState([]);
  
  // ID do cliente atual (em uma aplicação real, viria do contexto de autenticação)
  const clientId = "123";

  useEffect(() => {
    // Função para carregar os serviços do cliente
    const loadClientServices = () => {
      // Em uma aplicação real, você faria uma chamada à API para buscar 
      // apenas os serviços do cliente logado
      const clientServices = mockServices.filter(
        service => service.clientId === clientId
      );
      
      setServices(clientServices);
    };

    loadClientServices();
  }, [clientId]);

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <PageHeader 
          title="Meus Serviços Pendentes" 
          containerStyle={{backgroundColor: Colors.azulClaro}} 
          titleStyle={{color: '#fff'}}
      />

      {/* <View style={styles.header}>
        <Text style={styles.title}>Meus Serviços Pendentes</Text>
        <Text style={styles.subtitle}>
          Serviços pendentes para seus veículos
        </Text>
      </View> */}

      {services.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Você não possui serviços pendentes no momento.
          </Text>
        </View>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ServiceCard
              service={item}
              isAdminView={false} // Não é visão de admin
              // Não precisamos passar as funções de ação para a visão do cliente
            />
          )}
          contentContainerStyle={styles.list}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  list: {
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ServicePending;