// app/index.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  StatusBar,
  Alert,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

export default function LoginScreen() {
  const [userType, setUserType] = useState('cliente'); // 'cliente' ou 'admin'
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  

  const handleLogin = () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    
    setLoading(true);
    
    // Simulação de autenticação
    setTimeout(() => {
      setLoading(false);
      // Navegar para a página apropriada com base no tipo de usuário
      if (userType === 'admin') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/cliente/home');
      }
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cinzaClaro} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          {/* <Image
            style={styles.logo}
            source={require('../assets/logo.png')}
            resizeMode="contain"
          /> */}
          <Text style={styles.logoText}>TOP CAR</Text>
          <Text style={styles.tagline}>Oficina Especializada</Text>
        </View>

        <View style={styles.userTypeContainer}>
          <Text style={styles.selectText}>Selecione o tipo de usuário:</Text>
          
          <View style={styles.userTypeButtons}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'cliente' && styles.selectedUserType
              ]}
              onPress={() => setUserType('cliente')}
            >
              <MaterialIcons 
                name="person" 
                size={24} 
                color={userType === 'cliente' ? Colors.grafite : Colors.aluminio} 
              />
              <Text style={[
                styles.userTypeText,
                userType === 'cliente' && styles.selectedUserTypeText
              ]}>Cliente</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'admin' && styles.selectedUserType
              ]}
              onPress={() => setUserType('admin')}
            >
              <MaterialIcons 
                name="admin-panel-settings" 
                size={24} 
                color={userType === 'admin' ? Colors.grafite : Colors.aluminio} 
              />
              <Text style={[
                styles.userTypeText,
                userType === 'admin' && styles.selectedUserTypeText
              ]}>Administrador</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="email" size={20} color={Colors.grafite} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Seu e-mail"
                placeholderTextColor={Colors.aluminio}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock" size={20} color={Colors.grafite} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Sua senha"
                placeholderTextColor={Colors.aluminio}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialIcons 
                  name={showPassword ? "visibility" : "visibility-off"} 
                  size={20} 
                  color={Colors.grafite} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.loginButtonText}>ENTRANDO...</Text>
            ) : (
              <Text style={styles.loginButtonText}>ENTRAR</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Ainda não tem uma conta?</Text>
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => router.push('/cadastro')}
          >
            <Text style={styles.registerButtonText}>CADASTRE-SE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Top Car - Todos os direitos reservados</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cinzaClaro,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 10,
  },
  logoText: {
    fontFamily: 'DM-Sans-Bold',
    fontSize: 28,
    color: Colors.grafite,
    letterSpacing: 1,
  },
  tagline: {
    fontFamily: 'DM-Sans',
    fontSize: 14,
    color: Colors.grafite,
    opacity: 0.7,
  },
  userTypeContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectText: {
    fontFamily: 'DM-Sans-Medium',
    fontSize: 16,
    color: Colors.grafite,
    marginBottom: 12,
  },
  userTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  userTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    width: '48%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  selectedUserType: {
    backgroundColor: Colors.amarelo,
  },
  userTypeText: {
    fontFamily: 'DM-Sans-Medium',
    fontSize: 14,
    color: Colors.aluminio,
    marginLeft: 8,
  },
  selectedUserTypeText: {
    color: Colors.grafite,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'DM-Sans-Medium',
    fontSize: 14,
    color: Colors.grafite,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'DM-Sans',
    fontSize: 16,
    color: Colors.grafite,
    paddingVertical: 14,
  },
  passwordInput: {
    paddingRight: 40,
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontFamily: 'DM-Sans-Medium',
    fontSize: 14,
    color: Colors.azul,
  },
  loginButton: {
    backgroundColor: Colors.azul,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: Colors.aluminio,
  },
  loginButtonText: {
    fontFamily: 'DM-Sans-Bold',
    fontSize: 16,
    color: 'white',
    letterSpacing: 1,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.aluminio,
  },
  dividerText: {
    fontFamily: 'DM-Sans-Medium',
    fontSize: 14,
    color: Colors.grafite,
    paddingHorizontal: 16,
  },
  registerContainer: {
    alignItems: 'center',
  },
  registerText: {
    fontFamily: 'DM-Sans',
    fontSize: 16,
    color: Colors.grafite,
    marginBottom: 16,
  },
  registerButton: {
    backgroundColor: Colors.amarelo,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  registerButtonText: {
    fontFamily: 'DM-Sans-Bold',
    fontSize: 16,
    color: Colors.grafite,
    letterSpacing: 1,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  footerText: {
    fontFamily: 'DM-Sans',
    fontSize: 12,
    color: Colors.grafite,
    opacity: 0.5,
  },
});