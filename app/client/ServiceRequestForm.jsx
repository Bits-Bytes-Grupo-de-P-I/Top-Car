import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Switch, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";

import VehicleSelector from '@/components/ui/VehicleSelector'; // Ajuste o caminho conforme sua estrutura

import Colors from '@/constants/Colors'; // Ajuste o caminho conforme sua estrutura
import PageHeader from '@/components/ui/PageHeader'; // Ajuste o caminho conforme sua estrutura

const ServiceRequestForm = () => {
  const router = useRouter();
  
  // Estados para os campos do formulário
  const [vehicle, setVehicle] = useState(null);
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Lista simulada de veículos (substituir pela chamada à sua API/banco de dados)
  const [vehicles, setVehicles] = useState([
    { id: '1', name: 'Honda Civic', plate: 'ABC1234', model: 'Civic', year: '2020' },
    { id: '2', name: 'Toyota Corolla', plate: 'DEF5678', model: 'Corolla', year: '2019' },
    { id: '3', name: 'Fiat Uno', plate: 'GHI9012', model: 'Uno', year: '2018' },
  ]);

  // Atualiza os campos do formulário quando um veículo é selecionado
  const handleVehicleSelect = (selectedVehicle) => {
    setVehicle(selectedVehicle);
    if (selectedVehicle) {
      setVehicleName(selectedVehicle.name || '');
      setVehicleModel(selectedVehicle.model || '');
      setVehicleYear(selectedVehicle.year || '');
    }
  };

  // Limpa o formulário
  const handleClearForm = () => {
    setVehicle(null);
    setVehicleName('');
    setVehicleModel('');
    setVehicleYear('');
    setProblemDescription('');
    setIsUrgent(false);
  };

  // Envia o formulário
  const handleSubmit = async () => {
    // Validação básica
    if (!vehicleName || !vehicleModel || !vehicleYear || !problemDescription) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos do formulário.');
      return;
    }

    setIsLoading(true);

    try {
      // Preparar dados para envio
      const serviceRequestData = {
        vehicleName,
        vehicleModel,
        vehicleYear,
        problemDescription,
        isUrgent,
        vehicleId: vehicle?.id || null,
        plate: vehicle?.plate || null,
        requestDate: new Date().toISOString(),
      };

      // Simulação de envio para API
      console.log('Enviando dados:', serviceRequestData);
      
      // Aqui você faria sua chamada para a API
      // await api.post('/service-requests', serviceRequestData);
      
      // Simulando um tempo de processamento
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        'Pedido Enviado',
        'Seu pedido de atendimento foi enviado com sucesso! Um mecânico entrará em contato em breve.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              handleClearForm();
              router.back(); // Usar router.back() ou router.replace('/index')
            }
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      Alert.alert('Erro', 'Não foi possível enviar seu pedido. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>

    <PageHeader 
        title="Meus Serviços Pendentes" 
        containerStyle={{backgroundColor: Colors.azulClaro}} 
        titleStyle={{color: '#fff'}}
    />


    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        {/* <View style={styles.header}>
          <Text style={styles.title}>Novo Pedido de Atendimento</Text>
          <Text style={styles.subtitle}>Preencha os dados para solicitar atendimento de um mecânico</Text>
        </View> */}

        <View style={styles.formContainer}>
          {/* Seletor de Veículo */}
          <Text style={styles.sectionTitle}>Veículo</Text>
          <Text style={styles.sectionSubtitle}>Selecione um veículo cadastrado ou preencha os dados manualmente</Text>
          
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
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Modelo</Text>
            <TextInput
              style={styles.input}
              value={vehicleModel}
              onChangeText={setVehicleModel}
              placeholder="Ex: Civic LX"
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
            />
          </View>

          {/* Descrição do Problema */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Descrição do Problema</Text>
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

          {/* Serviço Urgente */}
          <View style={styles.switchContainer}>
            <View style={styles.switchGroup}>
              <Text style={styles.switchLabel}>Serviço Urgente</Text>
              <Text style={styles.switchDescription}>
                Marque esta opção para priorizar seu atendimento
              </Text>
            </View>
            <Switch
              value={isUrgent}
              onValueChange={setIsUrgent}
              trackColor={{ false: '#d1d1d1', true: '#b3e0ff' }}
              thumbColor={isUrgent ? '#007AFF' : '#f4f3f4'}
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
              style={[styles.submitButton, isLoading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.submitButtonText}>Enviando...</Text>
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Enviar Pedido</Text>
                  <MaterialIcons name="send" size={18} color="#fff" style={styles.sendIcon} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 24,
  },
  switchGroup: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  switchDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 32,
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    minWidth: 100,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 12,
  },
  disabledButton: {
    backgroundColor: '#b3d4ff',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  sendIcon: {
    marginLeft: 8,
  },
});

export default ServiceRequestForm;