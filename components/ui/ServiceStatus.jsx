import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Modal,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";

const ServiceStatus = () => {
  // Estados para controlar o dropdown e o status selecionado
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Em andamento");

  // Array com as opções de status
  const statusOptions = [
    { id: "1", title: "Em andamento", color: Colors.azul}, // Laranja para Em andamento
    { id: "2", title: "Aguardando Peça", color: Colors.laranja }, // Azul para Aguardando Peça
    { id: "3", title: "Finalizado", color: Colors.verde }, // Verde para Finalizado
  ];

  // Função para selecionar um status e fechar o modal
  const selectStatus = (status) => {
    setSelectedStatus(status.title);
    setModalVisible(false);
  };

  // Encontrar a cor correspondente ao status selecionado
  const getCurrentStatusColor = () => {
    const currentStatus = statusOptions.find(
      (status) => status.title === selectedStatus
    );
    return currentStatus ? currentStatus.color : "#FFA500"; // Cor padrão se não encontrar
  };

  return (
    // Container principal
    <View style={styles.containerPrincipal}>
      <TouchableHighlight
        style={{ width: "100%" }}
        underlayColor="#F0F0F0"
        onPress={() => setModalVisible(true)}
      >
        {/* Container do texto com a bolinha de status */}
        <View style={styles.containerTextoEBolinha}>
          <View
            style={[
              styles.bolinha,
              { backgroundColor: getCurrentStatusColor() },
            ]}
          ></View>
          <Text style={styles.texto}>{selectedStatus}</Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </View>
      </TouchableHighlight>

      {/* Modal para o dropdown */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableHighlight
          style={styles.modalOverlay}
          underlayColor="transparent"
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.dropdownContainer}>
            <FlatList
              data={statusOptions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableHighlight
                  underlayColor="#F0F0F0"
                  onPress={() => selectStatus(item)}
                >
                  <View style={styles.dropdownItem}>
                    <View
                      style={[styles.bolinha, { backgroundColor: item.color }]}
                    ></View>
                    <Text style={styles.dropdownText}>{item.title}</Text>
                  </View>
                </TouchableHighlight>
              )}
            />
          </View>
        </TouchableHighlight>
      </Modal>
    </View>
  );
};

export default ServiceStatus;

const styles = StyleSheet.create({
  containerPrincipal: {
    height: 36,
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "relative",
  },
  containerTextoEBolinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  texto: {
    color: "black",
    fontSize: 16,
    fontFamily: "DM-Sans",
    flex: 1,
  },
  bolinha: {
    height: 17,
    width: 17,
    borderRadius: 50,
    marginRight: 16,
  },
  dropdownIcon: {
    fontSize: 14,
    color: "#888",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  dropdownContainer: {
    marginTop: 60, // Posição do dropdown (ajuste conforme necessário)
    marginHorizontal: "5%",
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: "DM-Sans",
    color: "black",
  },
});
