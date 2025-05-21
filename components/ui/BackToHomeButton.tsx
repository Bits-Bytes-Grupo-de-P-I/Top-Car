//ESSE COMPONENTE DEVE SER EXCLUIDO AO FINAL DO PROJETO ---- SUA FUNÇÃO É APENAS PARA MELHORAR O FLUXO DE TRABALHO

import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

export default function BackToHomeButton() {
  const handleBack = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleBack}>
        <Text style={styles.buttonText}>← Voltar para seleção</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ccc',
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
  },
});
