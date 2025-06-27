// app/utils/notifications.js
import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let _counter = 0;

/**
 * Solicita permissão ao usuário (chame uma vez no início do app)
 */
export async function requestNotificationPermissions() {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão Negada',
        'Para receber notificações, permita-as nas configurações do sistema'
      );
    }
    return status;
  } catch (error) {
    console.error('Erro ao solicitar permissão', error);
    return 'error';
  }
}

/**
 * Envia uma notificação “imediata” (com trigger de 1s)
 * @param {{ title: string, body: string, data?: object }} opts
 */
export async function sendImmediateNotification({ title, body, data }) {
  try {
    _counter++;
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data },
      trigger: { seconds: 1 },
    });
  } catch (error) {
    console.error('Falha ao enviar notificação imediata', error);;
  }
}

/**
 * (Opcional) Retorna quantas notificações já foram enviadas nesta sessão
 */
export function getNotificationCount() {
  return _counter;
}
