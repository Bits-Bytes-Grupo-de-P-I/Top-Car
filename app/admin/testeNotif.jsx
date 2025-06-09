import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Platform 
} from 'react-native';
import * as Notifications from 'expo-notifications';

// Configurar handler das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function testeNotif() {
  const [permissaoStatus, setPermissaoStatus] = useState('unknown');
  const [contadorTestes, setContadorTestes] = useState(0);

  useEffect(() => {
    solicitarPermissoes();
  }, []);

  const solicitarPermissoes = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissaoStatus(status);
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'Para testar notificações, você precisa permitir nas configurações.'
        );
      }
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      setPermissaoStatus('error');
    }
  };

  const enviarNotificacaoImediata = async () => {
    try {
      // Para builds, usar scheduleNotificationAsync com delay mínimo
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🚀 Notificação Imediata",
          body: `Teste #${contadorTestes + 1} - Funcionou perfeitamente!`,
          data: { tipo: 'teste_imediato', numero: contadorTestes + 1 }
        },
        trigger: { seconds: 1 } // 1 segundo de delay
      });
      
      setContadorTestes(prev => prev + 1);
      Alert.alert('Enviado!', 'Notificação chegará em 1 segundo');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao enviar notificação imediata');
      console.error(error);
    }
  };

  const agendarNotificacao = async (segundos, titulo, corpo) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: titulo,
          body: corpo,
          data: { tipo: 'teste_agendado', delay: segundos }
        },
        trigger: { seconds: segundos }
      });
      
      Alert.alert(
        'Agendado!', 
        `Notificação chegará em ${segundos} segundos`
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao agendar notificação');
      console.error(error);
    }
  };

  const agendarLembreteRecorrente = async () => {
    try {
      // Para Android, usar channelId
      const channelId = Platform.OS === 'android' ? 'default' : undefined;
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📅 Lembrete Diário",
          body: "Não esqueça de usar o app hoje!",
          data: { tipo: 'lembrete_diario' }
        },
        trigger: {
          hour: 9,
          minute: 0,
          repeats: true,
          channelId
        }
      });
      
      Alert.alert(
        'Lembrete Configurado!', 
        'Você receberá um lembrete todos os dias às 9h'
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao configurar lembrete');
      console.error(error);
    }
  };

  // ... resto do código continua igual
}