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
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statsText: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonSecondary: {
    backgroundColor: '#E0E0E0',
    flex: 1,
    marginHorizontal: 4,
  },
  buttonSecondaryText: {
    color: '#333',
    fontWeight: '600',
  },
  buttonTertiary: {
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFD54F',
  },
  buttonTertiaryText: {
    color: '#795548',
    fontWeight: '600',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1976D2',
  },
  buttonOutlineText: {
    color: '#1976D2',
    fontWeight: '600',
  },
  footer: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
