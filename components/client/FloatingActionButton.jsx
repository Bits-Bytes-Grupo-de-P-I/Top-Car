import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Linking, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const FloatingActionButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const timeoutRef = useRef(null);

  // Função para resetar o timer de inatividade
  const resetInactivityTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Volta a ficar transparente após 5 segundos de inatividade
    timeoutRef.current = setTimeout(() => {
      if (isExpanded) {
        toggleExpansion(); // Fecha primeiro se estiver expandido
        setTimeout(() => {
          setIsVisible(false);
        }, 300); // Espera a animação de fechamento
      } else {
        setIsVisible(false);
      }
    }, 5000);
  };

  // Limpa o timer quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reinicia o timer sempre que o estado muda
  useEffect(() => {
    if (isVisible) {
      resetInactivityTimer();
    }
  }, [isVisible, isExpanded]);
  const openWhatsApp = () => {
    const phoneNumber = '5534999443790'; // número da empresa
    const message = 'Olá! Gostaria de mais informações.'; // Mensagem padrão que será enviada
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // Fallback para web WhatsApp
          Linking.openURL(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
        }
      })
      .catch((err) => console.error('Erro ao abrir WhatsApp:', err));
  };

  // Função para navegar para página de informações
  const openInfo = () => {
    router.push('./client/lgpdInfoPage');
  };

  // Primeiro clique - torna visível
  const handleFirstClick = () => {
    resetInactivityTimer(); // Reinicia o timer ao interagir
    
    if (!isVisible) {
      setIsVisible(true);
      return;
    }
    
    // Segundo clique - expande/contrai
    toggleExpansion();
  };

  // Função para obter o ícone correto baseado no estado
  const getMainIcon = () => {
    if (!isVisible) {
      return "ellipsis-horizontal";
    }
    return isExpanded ? "chevron-down" : "chevron-up";
  };
  const toggleExpansion = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      {/* Botões de ação - WhatsApp */}
      <Animated.View
        style={[
          styles.actionButton,
          styles.whatsappButton,
          {
            opacity: isVisible ? 1 : 0.5,
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [60, 0],
                }),
              },
              {
                scale: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.buttonContent}
          onPress={openWhatsApp}
          disabled={!isExpanded}
          activeOpacity={0.8}
        >
          <Ionicons name="logo-whatsapp" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Botões de ação - Informações */}
      <Animated.View
        style={[
          styles.actionButton,
          styles.infoButton,
          {
            opacity: isVisible ? 1 : 0.5,
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [60, 0],
                }),
              },
              {
                scale: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.buttonContent}
          onPress={openInfo}
          disabled={!isExpanded}
          activeOpacity={0.8}
        >
          <Ionicons name="information-circle" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Botão principal */}
      <TouchableOpacity
        style={[
          styles.mainButton,
          { opacity: isVisible ? 1 : 0.5 }
        ]}
        onPress={handleFirstClick}
        activeOpacity={0.8}
      >
        <Animated.View
          style={{
            transform: [
              {
                rotate: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '45deg'],
                }),
              },
            ],
          }}
        >
          <Ionicons 
            name={getMainIcon()} 
            size={28} 
            color="#fff" 
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
    elevation: 1000, // Para Android
  },
  mainButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  infoButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
});

export default FloatingActionButton;