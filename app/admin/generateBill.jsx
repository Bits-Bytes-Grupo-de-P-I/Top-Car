import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";

import Titulo from "@/components/ui/Titulo";
import Dropdown from "@/components/ui/Dropdown";

import Colors from "@/constants/Colors";

const generateBill = () => {
  return (
    <ImageBackground
          source={require("@/assets/images/fundo.jpg")}
          style={styles.background}
          resizeMode="cover"
        >
          <ScrollView
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
    <View style={styles.containerPrincipal}>
      <Titulo titulo="Informações do Cliente" />
      <View style={styles.container}>
        <Dropdown title='Deu certo?'>
            <Text>Deu certo!</Text>
        </Dropdown>
      </View>
    </View>
    </ScrollView>
    </ImageBackground>
  );
};

export default generateBill;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  containerPrincipal: {
    padding: 20,
  },
  container: {
    backgroundColor: Colors.azulClaro,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  opcoes: {
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderTopWidth: 0,
    borderRadius: 8,
  },
  opcao: {
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
