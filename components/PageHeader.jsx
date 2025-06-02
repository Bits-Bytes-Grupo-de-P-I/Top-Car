import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

// ÍCONES
import { FontAwesome6 } from "@expo/vector-icons";

/**
 * Componente de cabeçalho de página com título e botão de voltar
 *
 * @param {Object} props - Propriedades do componente
 * @param {string} props.title - Título a ser exibido
 * @param {function} [props.onBackPress] - Função opcional para sobrescrever o comportamento padrão de voltar
 * @param {Object} [props.containerStyle] - Estilos adicionais para o container
 * @param {Object} [props.titleStyle] - Estilos adicionais para o título
 * @param {boolean} [props.hideBackButton] - Se true, esconde o botão de voltar
 */

const PageHeader = ({
  title,
  onBackPress,
  containerStyle,
  titleStyle,
  hideBackButton = false,
}) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.header, containerStyle]}>
      {!hideBackButton && (
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, titleStyle]} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    position: "relative",
  },
  backButton: {
    padding: 8,
    position: "absolute",
    left: 8,
    zIndex: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
});

export default PageHeader;
