// Tela para visualização dos serviços pendentes criados pelo admin
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
// COMPONENTES
import PageHeader from "@/components/PageHeader";
import ServiceCard from "@/components/ServiceCard";
// CORES
import Colors from "@/constants/Colors";

const API_BASE_URL = "https://topcar-back-end.onrender.com";

const PendingServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // TODO: Implementar sistema de autenticação dinâmico
  // Por enquanto, considere obter o token de forma dinâmica
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJqb2FvQGV4YW1wbGUuY29tIiwiZnVuY2FvIjoiYWRtaW4iLCJpYXQiOjE3NDg0NTQzODR9.3fxamj4FEzv265boICnC3WqcJZLiJ0Kfsmbpg9S9lFs";

  useEffect(() => {
    loadServices();
  }, []);

  /**
   * Lista todas as pendências (o backend já retorna com JOIN)
   * @returns {Promise<Array>} Array com todas as pendências
   */
  const getAllPendencias = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pendencias`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Resposta do servidor:", errorData);
        throw new Error(`Erro ao buscar pendências: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao listar pendências:", error);
      throw error;
    }
  };

  /**
   * Edita uma pendência específica
   * @param {number|string} pendenciaId - ID da pendência a ser editada
   * @param {Object} updatedData - Dados atualizados da pendência
   * @returns {Promise<Object>} Pendência atualizada
   */
  const updatePendencia = async (pendenciaId, updatedData) => {
    try {
      console.log("Editando pendência:", pendenciaId, updatedData);

      const response = await fetch(`${API_BASE_URL}/pendencias/${pendenciaId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Erro na resposta do servidor:", errorData);
        throw new Error(`Erro ao editar pendência: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao editar pendência:", error);
      throw error;
    }
  };

  /**
   * Exclui uma pendência específica
   * @param {number|string} pendenciaId - ID da pendência a ser excluída
   * @returns {Promise<boolean>} True se a exclusão foi bem-sucedida
   */
  const deletePendencia = async (pendenciaId) => {
    try {
      console.log("Excluindo pendência:", pendenciaId);

      const response = await fetch(`${API_BASE_URL}/pendencias/${pendenciaId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Erro na resposta do servidor:", errorData);
        throw new Error(`Erro ao excluir pendência: ${response.status} - ${errorData}`);
      }

      return true;
    } catch (error) {
      console.error("Erro ao excluir pendência:", error);
      throw error;
    }
  };

  // Função para carregar todos os serviços da API
  const loadServices = async () => {
    try {
      setLoading(true);
      const pendencias = await getAllPendencias();

      console.log("Pendências carregadas:", pendencias);

      // Normaliza os dados para compatibilidade com o ServiceCard
      const normalizedServices = pendencias.map((pendencia) => ({
        ...pendencia,
        id: pendencia.id,
        cliente_nome: pendencia.cliente,
        veiculo_completo: `${pendencia.veiculo || ""} ${pendencia.modelo || ""}`.trim(),
        vehicle: `${pendencia.veiculo || ""} ${pendencia.modelo || ""}`.trim(),
        licensePlate: pendencia.placa || "",
        description: pendencia.descricao || "",
        clienteName: pendencia.cliente || "",
      }));

      setServices(normalizedServices);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível carregar os serviços pendentes. Tente novamente."
      );
      console.error("Erro ao carregar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar a lista (pull to refresh)
  const onRefresh = async () => {
    setRefreshing(true);
    await loadServices();
    setRefreshing(false);
  };

  // Manipulador para editar serviço
  const handleEditService = async (serviceId, updatedData) => {
    try {
      console.log("Tentando editar serviço:", serviceId, updatedData);
      setLoading(true);

      const originalService = services.find((s) => s.id == serviceId);
      if (!originalService) {
        throw new Error("Serviço não encontrado");
      }

      console.log("Serviço original encontrado:", originalService);

      const backendData = {
        descricao: updatedData.description,
        ...(originalService.cliente_id && { cliente_id: originalService.cliente_id }),
        ...(originalService.veiculo_id && { veiculo_id: originalService.veiculo_id }),
        ...(originalService.data_registro && { data_registro: originalService.data_registro }),
      };

      console.log("Dados sendo enviados para o backend:", backendData);

      await updatePendencia(serviceId, backendData);

      await loadServices();

      Alert.alert("Sucesso", "Serviço editado com sucesso!");
    } catch (error) {
      Alert.alert(
        "Erro",
        `Não foi possível editar o serviço: ${error.message}`
      );
      console.error("Erro ao editar serviço:", error);
    } finally {
      setLoading(false);
    }
  };

  // Manipulador para excluir serviço
  const handleDeleteService = (serviceId) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este serviço?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);

              await deletePendencia(serviceId);

              setServices((prevServices) =>
                prevServices.filter((service) => service.id != serviceId)
              );

              Alert.alert("Sucesso", "Serviço excluído com sucesso!");
            } catch (error) {
              Alert.alert(
                "Erro",
                `Não foi possível excluir o serviço: ${error.message}`
              );
              console.error("Erro ao excluir serviço:", error);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading && services?.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader
          title="Serviços em Pendência"
          containerStyle={{ backgroundColor: Colors.azulClaro }}
          titleStyle={{ color: "#fff" }}
        />
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={Colors.azulClaro} />
          <Text style={[styles.emptyStateText, { marginTop: 10 }]}>
            Carregando serviços...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader
        title="Serviços em Pendência"
        containerStyle={{ backgroundColor: Colors.azulClaro }}
        titleStyle={{ color: "#fff" }}
      />
      <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.container}
        resizeMode="cover"
      >
        {services?.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Não há serviços pendentes cadastrados.
            </Text>
          </View>
        ) : (
          <FlatList
            data={services}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <ServiceCard
                service={item}
                isAdminView={true}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
              />
            )}
            contentContainerStyle={styles.list}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}

        {/* Loading overlay para operações */}
        {loading && services?.length > 0 && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.azulClaro} />
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default PendingServices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  list: {
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
