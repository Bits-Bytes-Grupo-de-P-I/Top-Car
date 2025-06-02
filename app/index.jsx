import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

// CORES
import Colors from "@/constants/Colors";

export default function Index() {
  const handleRedirect = (userType) => {
    router.replace(`/${userType}`); // Vai para /client ou /admin
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione o tipo de usuário</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleRedirect('client')}>
        <Text style={styles.buttonText}>Cliente</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleRedirect('admin')}>
        <Text style={styles.buttonText}>Mecânico</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("./login")}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 40,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: Colors.azulClaro,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
