// hooks/useAuth.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const API_BASE_URL = 'https://topcar-back-end.onrender.com';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carrega dados do usuário do AsyncStorage
  const loadUserData = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('userToken');
      const savedUserData = await AsyncStorage.getItem('userData');

      if (savedToken && savedUserData) {
        const userData = JSON.parse(savedUserData);
        setToken(savedToken);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função de login
  const login = async (email, senha) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          senha: senha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const userToken = data.token;
        
        // Decodifica o token para obter dados do usuário
        const payload = JSON.parse(atob(userToken.split('.')[1]));
        const userData = {
          id: payload.id,
          email: payload.email,
          funcao: payload.funcao,
        };

        // Salva no AsyncStorage
        await AsyncStorage.setItem('userToken', userToken);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));

        // Atualiza o estado
        setToken(userToken);
        setUser(userData);
        setIsAuthenticated(true);

        return { success: true, user: userData };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        error: 'Erro de conexão. Verifique sua internet.' 
      };
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      router.replace('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Função para fazer requisições autenticadas
  const authenticatedFetch = async (url, options = {}) => {
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Se receber 401, token expirou
      if (response.status === 401) {
        await logout();
        throw new Error('Sessão expirada');
      }

      return response;
    } catch (error) {
      console.error('Erro na requisição autenticada:', error);
      throw error;
    }
  };

  // Função para buscar dados do usuário atualizado
  const refreshUserData = async () => {
    try {
      if (!token) return;

      const response = await authenticatedFetch(`${API_BASE_URL}/clientes`);
      
      if (response.ok) {
        const clientes = await response.json();
        const userAtualizado = clientes.find(cliente => cliente.id === user.id);
        
        if (userAtualizado) {
          const userData = {
            id: userAtualizado.id,
            email: userAtualizado.email,
            funcao: userAtualizado.funcao,
            nome: userAtualizado.nome,
          };
          
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  // Verifica se é admin
  const isAdmin = () => {
    return user && user.funcao === 'admin';
  };

  // Verifica se é cliente
  const isClient = () => {
    return user && user.funcao !== 'admin';
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    authenticatedFetch,
    refreshUserData,
    isAdmin,
    isClient,
  };
};

// Contexto de autenticação (opcional)
import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de AuthProvider');
  }
  return context;
};