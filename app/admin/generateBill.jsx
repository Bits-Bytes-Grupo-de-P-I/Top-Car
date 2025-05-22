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
import { SafeAreaView } from "react-native-safe-area-context"; //import para concertar a tela no celular
import PageHeader from "@/components/ui/PageHeader";
import ExpandableMenu from "@/components/ui/ExpandableMenu";

import Colors from "@/constants/Colors";

const generateBill = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <PageHeader
          title="Gerar Nota de Serviço"
          containerStyle={{ backgroundColor: Colors.azulClaro }}
          titleStyle={{ color: "#fff" }}
        />
        <ScrollView
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.containerPrincipal}>
            <View style={styles.container}>
              <ExpandableMenu />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
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
    flex: 1,
  },
  ExpandableMenu: {
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
