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

// Simulação das funções do expo-notifications para demonstração
// No seu projeto real, você importaria assim:
// import * as Notifications from 'expo-notifications';

// Simulação para o exemplo funcionar
const Notifications = {
  requestPermissionsAsync: async () => ({ status: 'granted' }),
  presentNotificationAsync: async (content) => {
    console.log('Notificação imediata:', content);
    Alert.alert('Simulação', `Notificação enviada: ${content.title}`);
  },
  scheduleNotificationAsync: async (notification) => {
    console.log('Notificação agendada:', notification);
    Alert.alert('Simulação', `Notificação agendada para ${notification.trigger.seconds}s`);
  },
  setNotificationHandler: (handler) => {
    console.log('Handler configurado:', handler);
  }
};

// Configurar handler das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
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
      await Notifications.presentNotificationAsync({
        title: "🚀 Notificação Imediata",
        body: `Teste #${contadorTestes + 1} - Funcionou perfeitamente!`,
        data: { tipo: 'teste_imediato', numero: contadorTestes + 1 }
      });
      
      setContadorTestes(prev => prev + 1);
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
      // Simula um lembrete diário às 9h
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📅 Lembrete Diário",
          body: "Não esqueça de usar o app hoje!",
          data: { tipo: 'lembrete_diario' }
        },
        trigger: {
          hour: 9,
          minute: 0,
          repeats: true
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

  const getStatusColor = () => {
    switch (permissaoStatus) {
      case 'granted': return '#4CAF50';
      case 'denied': return '#F44336';
      case 'error': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = () => {
    switch (permissaoStatus) {
      case 'granted': return 'Permitida ✅';
      case 'denied': return 'Negada ❌';
      case 'error': return 'Erro ⚠️';
      default: return 'Verificando...';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔔 Teste de Notificações</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>
            Permissão: {getStatusText()}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Testes realizados: {contadorTestes}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificações Imediatas</Text>
        <Text style={styles.sectionDescription}>
          Aparecem instantaneamente na tela
        </Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={enviarNotificacaoImediata}
        >
          <Text style={styles.buttonText}>🚀 Enviar Agora</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificações Agendadas</Text>
        <Text style={styles.sectionDescription}>
          Teste diferentes tempos de atraso
        </Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.buttonSecondary]} 
            onPress={() => agendarNotificacao(5, "⏰ 5 Segundos", "Teste rápido!")}
          >
            <Text style={styles.buttonSecondaryText}>5s</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.buttonSecondary]} 
            onPress={() => agendarNotificacao(10, "⏰ 10 Segundos", "Teste médio!")}
          >
            <Text style={styles.buttonSecondaryText}>10s</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.buttonSecondary]} 
            onPress={() => agendarNotificacao(30, "⏰ 30 Segundos", "Teste longo!")}
          >
            <Text style={styles.buttonSecondaryText}>30s</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lembretes Recorrentes</Text>
        <Text style={styles.sectionDescription}>
          Configure notificações que se repetem
        </Text>
        
        <TouchableOpacity 
          style={[styles.button, styles.buttonTertiary]} 
          onPress={agendarLembreteRecorrente}
        >
          <Text style={styles.buttonTertiaryText}>📅 Lembrete Diário (9h)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        
        <TouchableOpacity 
          style={[styles.button, styles.buttonOutline]} 
          onPress={solicitarPermissoes}
        >
          <Text style={styles.buttonOutlineText}>🔄 Verificar Permissões</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 Dica: Minimize o app para ver as notificações funcionando
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonSecondaryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTertiary: {
    backgroundColor: '#FF9800',
  },
  buttonTertiaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  buttonOutlineText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    margin: 15,
    padding: 15,
    backgroundColor: '#fff3cd',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  footerText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});