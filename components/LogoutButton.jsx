import React from 'react';
import { TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useAuthContext } from '@/hooks/useAuth'; // ajuste o caminho se necessário

export default function LogoutButton() {
  const { logout } = useAuthContext();

  const confirmLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => logout() },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={confirmLogout}>
      <Entypo name="login" size={24} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    backgroundColor: 'transparent',
  },
});
