import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
// COMPONENTES
import Slider from "@/components/Slider";
import VehicleSelector from "@/components/client/VehicleSelector";
import PageHeader from "@/components/PageHeader";
// ÍCONES
import { MaterialIcons } from "@expo/vector-icons";
// CORES
import Colors from "@/constants/Colors";

const serviceRequestForm = () => {
  const router = useRouter();
  // Estados para os campos do formulário
  const [vehicles, setVehicles] = useState([]); // Lista de todos os carros
  const [vehicle, setVehicle] = useState(null);
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [problemSummary, setProblemSummary] = useState("");
  const [summaryLength, setSummaryLength] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");

  // Token de autorização
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJqb2FvQGV4YW1wbGUuY29tIiwiZnVuY2FvIjoiYWRtaW4iLCJpYXQiOjE3NDg0NTQzODR9.3fxamj4FEzv265boICnC3WqcJZLiJ0Kfsmbpg9S9lFs"; // PRECISA ARMAZENAR DE MODO SEGURO!

  // Função para buscar veículos
  const fetchVehicles = async () => {
    try {
      const response = await fetch(
        "https://topcar-back-end.onrender.com/veiculos",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      // Formato original do mock:
      const transformedData = data.map((vehicle) => ({
        id: vehicle.id.toString(),
        name: `${vehicle.marca} ${vehicle.modelo}`,
        plate: vehicle.placa,
        model: vehicle.modelo,
        year: vehicle.ano.toString(),
      }));
      setVehicles(transformedData);
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
    }
  };

  // Chama a função quando o componente carregar
  useEffect(() => {
    fetchVehicles();
    // Define a data padrão como hoje
    const today = new Date().toISOString().split('T')[0];
    setScheduledDate(today);
  }, []);

  // Atualiza os campos do formulário quando um veículo é selecionado
  const handleVehicleSelect = (selectedVehicle) => {
    setVehicle(selectedVehicle);
    if (selectedVehicle) {
      setVehicleName(selectedVehicle.name || "");
      setVehicleModel(selectedVehicle.model || "");
      setVehicleYear(selectedVehicle.year || "");
    }
  };

  // Limpa o formulário
  const handleClearForm = () => {
    setVehicle(null);
    setVehicleName("");
    setVehicleModel("");
    setVehicleYear("");
    setProblemDescription("");
    setProblemSummary("");
    const today = new Date().toISOString().split('T')[0];
    setScheduledDate(today);
  };

  // Envia o formulário
  const handleSubmit = async () => {
    if (!vehicle || !problemDescription || !scheduledDate) {
      Alert.alert(
        "Campos obrigatórios",
        "Selecione um veículo, descreva o problema e informe a data desejada."
      );
      return;
    }

    setIsLoading(true);
    try {
      const agendamentoData = {
        cliente_id: 6, // ID do cliente logado
        veiculo_id: parseInt(vehicle.id), // Converter para número
        servico_id: 4,
        descricao: problemDescription,
        data_agendada: scheduledDate,
        status: "Pendente", // Precisa ter a inicial maiúscula aquui
        urgente: false
      };

      console.log("Dados que serão enviados:", agendamentoData);

      const response = await fetch(
        "https://topcar-back-end.onrender.com/agendamentos",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(agendamentoData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Erro na requisição:", errorData);
        throw new Error(errorData.error || "Erro ao criar agendamento");
      }

      const result = await response.json();
      console.log("Agendamento criado:", result);

      Alert.alert(
        "Agendamento Criado",
        "Seu agendamento foi criado com sucesso!",
        [
          {
            text: "OK",
            onPress: () => {
              handleClearForm();
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      Alert.alert(
        "Erro",
        "Não foi possível criar seu agendamento. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageHeader
        title="Solicitar Agendamento"
        containerStyle={{ backgroundColor: Colors.azulClaro }}
        titleStyle={{ color: "#fff" }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container}>
          <View style={styles.formContainer}>
            {/* Seletor de Veículo */}
            <Text style={styles.sectionTitle}>Veículo</Text>
            <Text style={styles.sectionSubtitle}>
              Selecione um veículo cadastrado ou preencha os dados manualmente
            </Text>
            <VehicleSelector
              onVehicleSelect={handleVehicleSelect}
              initialVehicleId={vehicle?.id}
              vehicles={vehicles}
            />

            {/* Campos de Veículo */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome do Veículo</Text>
              <TextInput
                style={styles.input}
                value={vehicleName}
                onChangeText={setVehicleName}
                placeholder="Ex: Honda Civic"
                editable={false} // Campo apenas para visualização
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Modelo</Text>
              <TextInput
                style={styles.input}
                value={vehicleModel}
                onChangeText={setVehicleModel}
                placeholder="Ex: Civic LX"
                editable={false} // Campo apenas para visualização
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Ano</Text>
              <TextInput
                style={styles.input}
                value={vehicleYear}
                onChangeText={setVehicleYear}
                placeholder="Ex: 2020"
                keyboardType="numeric"
                maxLength={4}
                editable={false} // Campo apenas para visualização
              />
            </View>

            {/* Data do Agendamento */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Data Desejada *</Text>
              <TextInput
                style={styles.input}
                value={scheduledDate}
                onChangeText={setScheduledDate}
                placeholder="YYYY-MM-DD"
                // Você pode implementar um DatePicker aqui
              />
            </View>

            {/* Descrição do Problema */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Descrição do Problema *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={problemDescription}
                onChangeText={setProblemDescription}
                placeholder="Descreva em detalhes o problema que está tendo com o veículo..."
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            {/* Botões de Ação */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearForm}
                disabled={isLoading}
              >
                <Text style={styles.clearButtonText}>Limpar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isLoading && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Text style={styles.submitButtonText}>Enviando...</Text>
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Criar Agendamento</Text>
                    <MaterialIcons
                      name="send"
                      size={18}
                      color="#fff"
                      style={styles.sendIcon}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default serviceRequestForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    padding: 20,
    backgroundColor: Colors.azul,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  summaryCounter: {
    marginLeft: 8,
    color: "#606060"
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 24,
  },
  switchGroup: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  switchDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 32,
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: Colors.azulClaro,
    minWidth: 100,
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    fontWeight: "bold",
  },
  submitButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.verde,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 12,
  },
  disabledButton: {
    backgroundColor: "#b3d4ff",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  sendIcon: {
    marginLeft: 8,
  },
});

