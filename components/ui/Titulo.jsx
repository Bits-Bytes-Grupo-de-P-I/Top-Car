import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import React from "react";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import Colors from "@/constants/Colors";

const Titulo = (props) => {
  return (
    <ImageBackground
      source={require("@/assets/images/fundo.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
            <Text style={styles.titulo}>{props.titulo}</Text>
            <TouchableOpacity 
              style={styles.voltar} 
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={30} color={Colors.vermelho} />
            </TouchableOpacity>
          </View>
        
        
      </ScrollView>
    </ImageBackground>
  );
};

export default Titulo;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 48
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.azulClaro,
    textAlign: "center",
    fontFamily: 'DM-Sans'
  },
  voltar: {
    position: "absolute",
    left: 0,
    padding: 8,
  }
});