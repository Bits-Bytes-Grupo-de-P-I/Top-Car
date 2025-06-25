// components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Colors = {
  grafite: "#2B2B2B",
  amarelo: "#E5D100",
  aluminio: "#D9D9D9",
  azul: "#4285F4",
  cinzaClaro: "#F9F9F9",
};

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, // 'admin' ou null (qualquer usuário logado)
  redirectTo = '/' 
}) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuthorization = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');

      if (!token || !userData) {
        // Não está logado
        router.replace(redirectTo);
        return;
      }

      const user = JSON.parse(userData);

      // Verifica se o papel é requerido
      if (requiredRole && user.funcao !== requiredRole) {
        // Não tem permissão
        router.replace(redirectTo);
        return;
      }

      // Usuário autorizado
      setIsAuthorized(true);
    } catch (error) {
      console.error('Erro ao verificar autorização:', error);
      router.replace(redirectTo);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.azul} />
        <Text style={styles.loadingText}>Verificando acesso...</Text>
      </View>
    );
  }

  if (!isAuthorized) {
    return (
      <View style={styles.unauthorizedContainer}>
        <Text style={styles.unauthorizedText}>Acesso negado</Text>
      </View>
    );
  }

  return children;
};

// Componente específico para rotas de admin
export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="admin" redirectTo="/">
      {children}
    </ProtectedRoute>
  );
};

// Componente específico para rotas de cliente
export const ClientRoute = ({ children }) => {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cinzaClaro,
  },
  loadingText: {
    fontFamily: 'DM-Sans',
    fontSize: 16,
    color: Colors.grafite,
    marginTop: 16,
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cinzaClaro,
  },
  unauthorizedText: {
    fontFamily: 'DM-Sans-Bold',
    fontSize: 18,
    color: Colors.grafite,
  },
});

export default ProtectedRoute;