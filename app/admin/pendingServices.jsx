// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   FlatList,
//   ImageBackground,
// } from "react-native";
// import React, { useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import Colors from "@/constants/Colors";
// import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
// import Entypo from "@expo/vector-icons/Entypo";

// import Titulo from "@/components/ui/Titulo";
// import Emergencia from "@/components/ui/Emergencia";

// // Dados de exemplo para serviços pendentes
// const servicosPendentesExemplo = [
//   {
//     id: '1',
//     clienteNome: 'João Silva',
//     veiculo: 'Toyota Corolla',
//     placa: 'ABC-1234',
//     servico: 'Troca de óleo',
//     status: 'Urgente',
//     dataAgendada: '12/05/2025',
//     urgente: true,
//   },
//   {
//     id: '2',
//     clienteNome: 'Maria Oliveira',
//     veiculo: 'Honda Civic',
//     placa: 'DEF-5678',
//     servico: 'Revisão completa',
//     status: 'Aguardando peças',
//     dataAgendada: '14/05/2025',
//     urgente: false,
//   },
//   {
//     id: '3',
//     clienteNome: 'Pedro Santos',
//     veiculo: 'Volkswagen Gol',
//     placa: 'GHI-9012',
//     servico: 'Troca de pneus',
//     status: 'Aguardando aprovação',
//     dataAgendada: '13/05/2025',
//     urgente: false,
//   },
//   {
//     id: '4',
//     clienteNome: 'Ana Costa',
//     veiculo: 'Fiat Uno',
//     placa: 'JKL-3456',
//     servico: 'Reparo no freio',
//     status: 'Agendado',
//     dataAgendada: '15/05/2025',
//     urgente: true,
//   },
//   {
//     id: '5',
//     clienteNome: 'Carlos Mendes',
//     veiculo: 'Chevrolet Onix',
//     placa: 'MNO-7890',
//     servico: 'Alinhamento e balanceamento',
//     status: 'Aguardando peças',
//     dataAgendada: '16/05/2025',
//     urgente: false,
//   },
// ];

// // Componente para cada item da lista de serviços pendentes
// const ServicoItem = ({ item, onPress }) => {
//   return (
//     <TouchableOpacity 
//       style={[
//         styles.servicoItem, 
//         item.urgente ? styles.servicoUrgente : {}
//       ]} 
//       onPress={() => onPress(item)}
//     >
//       <View style={styles.servicoHeader}>
//         <Text style={styles.clienteNome}>{item.clienteNome}</Text>
//         {item.urgente && (
//           <View style={styles.urgenteBadge}>
//             <Emergencia/>
//           </View>
//         )}
//       </View>
      
//       <View style={styles.servicoInfo}>
//         <View style={styles.infoRow}>
//           <FontAwesome6 name="car" size={14} color={Colors.azulClaro} />
//           <Text style={styles.infoText}>{item.veiculo} - {item.placa}</Text>
//         </View>
//         <View style={styles.infoRow}>
//           <FontAwesome6 name="wrench" size={14} color={Colors.azulClaro} />
//           <Text style={styles.infoText}>{item.servico}</Text>
//         </View>
//         <View style={styles.infoRow}>
//           <FontAwesome6 name="calendar" size={14} color={Colors.azulClaro} />
//           <Text style={styles.infoText}>{item.dataAgendada}</Text>
//         </View>
//       </View>
      
//       <View style={styles.statusContainer}>
//         {/* <Text style={[
//           styles.statusText, 
//           item.status === 'Agendado' ? styles.statusAgendado :
//           item.status === 'Aguardando peças' ? styles.statusAguardandoPecas :
//           styles.statusAguardandoAprovacao
//         ]}>
//           {item.status}
//         </Text> */}
//         <FontAwesome6 name="chevron-right" size={16} color={Colors.cinzaEscuro} />
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default function ServicePending() {
//   const router = useRouter();
//   const [servicos, setServicos] = useState(servicosPendentesExemplo);
//   const [filtroAtivo, setFiltroAtivo] = useState('Todos');

//   // Função para lidar com o toque em um serviço
//   const handleServicoPress = (servico) => {
//     alert(`Detalhes do serviço de ${servico.clienteNome}`);
//     // Aqui que vai abrir o modal de detalhes do serviço
//   };

//   // Filtrar os serviços com base no filtro ativo
//   const servicosFiltrados = filtroAtivo === 'Todos' 
//     ? servicos 
//     : filtroAtivo === 'Urgentes'
//       ? servicos.filter(s => s.urgente)
//       : servicos.filter(s => s.status === filtroAtivo);

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <ImageBackground
//         source={require("@/assets/images/fundo.jpg")}
//         style={styles.background}
//         resizeMode="cover"
//       >
//         {/* Barra do topo */}
//         <View style={styles.barraTopo}>
//           <Titulo titulo='Serviços em Pendência'/>
//         </View>

//         {/* Filtros de serviços */}
//         {/* <View style={styles.filtrosContainer}>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {['Todos', 'Urgentes', 'Agendado', 'Aguardando peças', 'Aguardando aprovação'].map((filtro) => (
//               <TouchableOpacity 
//                 key={filtro}
//                 style={[
//                   styles.filtroItem,
//                   filtroAtivo === filtro ? styles.filtroItemAtivo : {}
//                 ]}
//                 onPress={() => setFiltroAtivo(filtro)}
//               >
//                 <Text style={[
//                   styles.filtroTexto,
//                   filtroAtivo === filtro ? styles.filtroTextoAtivo : {}
//                 ]}>
//                   {filtro}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View> */}

//         {/* Lista de serviços */}
//         <FlatList
//           data={servicosFiltrados}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <ServicoItem item={item} onPress={handleServicoPress} />
//           )}
//           contentContainerStyle={styles.listaContainer}
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <FontAwesome6 name="check-circle" size={50} color={Colors.verde} />
//               <Text style={styles.emptyText}>Não há serviços pendentes nesta categoria</Text>
//             </View>
//           }
//         />

//         {/* Botão de adicionar novo serviço */}
//         <TouchableOpacity style={styles.botaoAdicionar}>
//           <FontAwesome6 name="plus" size={20} color="white" />
//         </TouchableOpacity>
//       </ImageBackground>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//   },
//   barraTopo: {
//     width: "100%",
//     paddingHorizontal: 20,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   tituloTopo: {
//     fontFamily: "DM-Sans",
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "white",
//   },
//   filtrosContainer: {
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     backgroundColor: "white",
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.cinzaClaro,
//   },
//   filtroItem: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     marginHorizontal: 4,
//     borderRadius: 20,
//     backgroundColor: Colors.cinzaClaro,
//   },
//   filtroItemAtivo: {
//     backgroundColor: Colors.azulClaro,
//   },
//   filtroTexto: {
//     fontSize: 14,
//     color: Colors.cinzaEscuro,
//   },
//   filtroTextoAtivo: {
//     color: "white",
//     fontWeight: "bold",
//   },
//   listaContainer: {
//     padding: 16,
//     paddingBottom: 80, // Espaço para o botão flutuante
//   },
//   servicoItem: {
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 12,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   servicoUrgente: {
//     borderLeftWidth: 4,
//     borderLeftColor: Colors.laranja,
//   },
//   servicoHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   clienteNome: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: Colors.azulClaro,
//   },
//   urgenteBadge: {
//     paddingVertical: 2,
//     paddingHorizontal: 8,
//     borderRadius: 12,
//   },
//   urgenteText: {
//     color: "white",
//     fontSize: 10,
//     fontWeight: "bold",
//   },
//   servicoInfo: {
//     marginBottom: 10,
//   },
//   infoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   infoText: {
//     marginLeft: 8,
//     fontSize: 14,
//     color: Colors.cinzaEscuro,
//   },
//   statusContainer: {
//     flexDirection: "row",
//     justifyContent: "flex-end", // original: space-between
//     alignItems: "center",
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: Colors.cinzaClaro,
//   },
//   statusText: {
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   statusAgendado: {
//     color: Colors.verde,
//   },
//   statusAguardandoPecas: {
//     color: Colors.azulClaro,
//   },
//   statusAguardandoAprovacao: {
//     color: Colors.laranja,
//   },
//   emptyContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 40,
//   },
//   emptyText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: Colors.cinzaEscuro,
//     textAlign: "center",
//   },
//   botaoAdicionar: {
//     position: "absolute",
//     bottom: 20,
//     right: 20,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: Colors.azulClaro,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
// });

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import PageHeader from '@/components/ui/PageHeader';
import Colors from '@/constants/Colors';

import ServiceCard from '@/components/ui/ServiceCard'; //componente de card de serviços pendentes
import mockServices from '@/assets/mocks/pendenciasMock.json'; // Mock de serviços pendentes

/**
 * Tela de serviços pendentes para o ADMINISTRADOR
 * Essa tela exibe todos os serviços pendentes e permite gerenciá-los
 */

const pendingServices = () => {
  const [services, setServices] = useState([]);
  
  // ID do administrador atual (em uma aplicação real, viria do contexto de autenticação)
  const adminId = "456";

  useEffect(() => {
    // Função para carregar todos os serviços 
    const loadAllServices = () => {
      // Em uma aplicação real, você faria uma chamada à API
      // e possivelmente filtraria pelos serviços criados por este admin específico
      // const adminServices = mockServices.filter(
      //   service => service.createdBy === `admin${adminId}`
      // );
      
      // Neste exemplo, estamos mostrando todos os serviços para o admin
      setServices(mockServices);
    };

    loadAllServices();
  }, [adminId]);

  // Manipuladores de eventos para ações do administrador
  const handleEditService = (serviceId) => {
    console.log(`Editar serviço ID: ${serviceId}`);
    // Aqui você navegaria para uma tela de edição ou abriria um modal
    // navigate(`/service/edit/${serviceId}`); 
  };

  const handleDeleteService = (serviceId) => {
    console.log(`Excluir serviço ID: ${serviceId}`);
    // Aqui você removeria o serviço da lista e faria uma chamada à API
    setServices(services.filter(service => service.id !== serviceId));
    // Em produção você faria algo como: deleteServiceAPI(serviceId)
  };

  const handleAcceptService = (serviceId) => {
    console.log(`Aceitar serviço ID: ${serviceId}`);
    // Atualiza o status do serviço localmente
    setServices(services.map(service => 
      service.id === serviceId 
        ? { ...service, isAccepted: !service.isAccepted } 
        : service
    ));
    // Em produção você faria algo como: updateServiceStatusAPI(serviceId, 'accepted')
  };

  return (
    <SafeAreaView style={styles.container}>

      <PageHeader 
        title="Serviços Pendentes da Oficina" 
        containerStyle={{backgroundColor: Colors.azulClaro}} 
        titleStyle={{color: '#fff'}}
      />

      {/* <View style={styles.header}>
        <Text style={styles.title}>Gerenciar Serviços</Text>
        <Text style={styles.subtitle}>
          Todos os serviços pendentes da oficina
        </Text>
      </View> */}

      {services.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Não há serviços pendentes cadastrados.
          </Text>
        </View>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ServiceCard
              service={item}
              isAdminView={true} // É visão de admin
              onEdit={handleEditService}
              onDelete={handleDeleteService}
              onAccept={handleAcceptService}
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

export default pendingServices;