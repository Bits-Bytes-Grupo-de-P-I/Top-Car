// import { Redirect } from "expo-router";
// import { APP_VERSION } from "../env";

// export default function Index() {
//   if (APP_VERSION === "admin") {
//     return <Redirect href="/admin" />;
//   } else {
//     return <Redirect href="/client" />;
//   }
// }

// import { Redirect } from "expo-router";

// export default function Index() {
//   return <Redirect href="./cliente" />; //Tem que alterar para client ou admin
// }

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Index() {
  const handleRedirect = (userType: 'client' | 'admin') => {
    router.replace(`/${userType}`); // Isso vai para /client ou /admin
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
    backgroundColor: '#007bff',
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
