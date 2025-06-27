// Tela de login
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
  Dimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Cores do seu projeto
const Colors = {
  grafite: "#2B2B2B",
  amarelo: "#E5D100",
  aluminio: "#D9D9D9",
  azul: "#4285F4",
  azulClaro: "#03B6DE",
  cinzaClaro: "#F9F9F9",
  vermelho: "#EF4444",
  laranja: "#F97316",
  verde: "#10B981",
  verdeEscuro: "#0C7358",
};

const API_BASE_URL = "https://topcar-back-end.onrender.com";

export default function index() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Função para salvar token no AsyncStorage
  const saveToken = async (token) => {
    try {
      await AsyncStorage.setItem("userToken", token);
    } catch (error) {
      console.error("Erro ao salvar token:", error);
    }
  };

  // Função para salvar dados do usuário
  const saveUserData = async (userData) => {
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
    } catch (error) {
      console.error("Erro ao salvar dados do usuário:", error);
    }
  };

  // Função principal de login
   const handleLogin = async () => {
    if (!email || !senha) {
      return Alert.alert('Erro', 'Por favor, preencha todos os campos');
    }
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), senha })
      });
      const data = await resp.json();
      if (resp.ok) {
        const token = data.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userData = { id: payload.id, nome:payload.nome, email: payload.email, funcao: payload.funcao };
        await saveToken(token);
        await saveUserData(userData);

        Alert.alert('Sucesso', 'Login realizado com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              const destino = userData.funcao === 'admin'
                ? '/admin'
                : '/client';
              router.replace(destino);
            }
          }
        ]);
      } else {
        let msg = 'Erro ao fazer login';
        if (data.error === 'Email não encontrado')
          msg = 'Email não cadastrado no sistema';
        else if (data.error === 'Senha incorreta')
          msg = 'Senha incorreta';
        else msg = data.error || msg;
        Alert.alert('Erro de Login', msg);
      }
    } catch (err) {
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      if (token && userData) {
        const u = JSON.parse(userData);
        router.replace(u.funcao === 'admin' ? '/admin' : '/client');
      }
    })();
  }, []);

  // Função para logout (útil para outras telas)
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      router.replace("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Função para verificar se já está logado
  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");

      if (token && userData) {
        const user = JSON.parse(userData);
        // Se já está logado, redireciona diretamente
        if (user.funcao === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/client");
        }
      }
    } catch (error) {
      console.error("Erro ao verificar status de autenticação:", error);
    }
  };

  // Verifica se já está logado ao carregar a tela
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.grafite}
        translucent
      />

      <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={require("@/assets/images/logo-login.png")}
              style={{ width: 150, height: 120, marginHorizontal: "auto" }}
            />

            <View style={styles.formCard}>
              <View style={styles.userTypeContainer}>
                <Text style={styles.selectText}>
                  Selecione o tipo de usuário:
                </Text>

                
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>E-mail</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons
                      name="email"
                      size={20}
                      color={Colors.grafite}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Seu e-mail"
                      placeholderTextColor={Colors.aluminio}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      editable={!loading}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Senha</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons
                      name="lock"
                      size={20}
                      color={Colors.grafite}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, styles.passwordInput]}
                      placeholder="Sua senha"
                      placeholderTextColor={Colors.aluminio}
                      value={senha}
                      onChangeText={setSenha}
                      secureTextEntry={!showPassword}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      <MaterialIcons
                        name={showPassword ? "visibility" : "visibility-off"}
                        size={20}
                        color={Colors.grafite}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    loading && styles.loginButtonDisabled,
                  ]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="white" />
                      <Text
                        style={[styles.loginButtonText, { marginLeft: 10 }]}
                      >
                        ENTRANDO...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.loginButtonText}>ENTRAR</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2025 Top Car - Todos os direitos reservados
            </Text>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(43, 43, 43, 0.7)", // Overlay semi-transparente
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: StatusBar.currentHeight + 20 || 60,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoText: {
    fontFamily: "DM-Sans-Bold",
    fontSize: 32,
    color: Colors.amarelo,
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontFamily: "DM-Sans",
    fontSize: 16,
    color: "white",
    opacity: 0.9,
    marginTop: 5,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  userTypeContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  selectText: {
    fontFamily: "DM-Sans-Medium",
    fontSize: 16,
    color: Colors.grafite,
    marginBottom: 16,
  },
  userTypeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  userTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.cinzaClaro,
    borderRadius: 12,
    padding: 12,
    width: "48%",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedUserType: {
    backgroundColor: Colors.amarelo,
    borderColor: Colors.grafite,
  },
  userTypeText: {
    fontFamily: "DM-Sans-Medium",
    fontSize: 14,
    color: Colors.aluminio,
    marginLeft: 8,
  },
  selectedUserTypeText: {
    color: Colors.grafite,
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: "DM-Sans-Medium",
    fontSize: 14,
    color: Colors.grafite,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: Colors.aluminio,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: "DM-Sans",
    fontSize: 16,
    color: Colors.grafite,
    paddingVertical: 16,
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: "absolute",
    right: 16,
    padding: 5,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontFamily: "DM-Sans-Medium",
    fontSize: 14,
    color: Colors.azul,
  },
  loginButton: {
    backgroundColor: Colors.azul,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.azul,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: Colors.aluminio,
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    fontFamily: "DM-Sans-Bold",
    fontSize: 16,
    color: "white",
    letterSpacing: 1,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.aluminio,
  },
  dividerText: {
    fontFamily: "DM-Sans-Medium",
    fontSize: 14,
    color: Colors.grafite,
    paddingHorizontal: 16,
  },
  registerContainer: {
    alignItems: "center",
  },
  registerText: {
    fontFamily: "DM-Sans",
    fontSize: 16,
    color: Colors.grafite,
    marginBottom: 16,
  },
  registerButton: {
    backgroundColor: Colors.amarelo,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    shadowColor: Colors.amarelo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonText: {
    fontFamily: "DM-Sans-Bold",
    fontSize: 16,
    color: Colors.grafite,
    letterSpacing: 1,
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  footerText: {
    fontFamily: "DM-Sans",
    fontSize: 12,
    color: "white",
    opacity: 0.7,
    textAlign: "center",
  },
});
