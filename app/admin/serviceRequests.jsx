// Tela para visualizar os pedidos feitos pelos clientes

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Esse import precisa ser diferente para funcionar corretamente
import { useState } from "react";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

// COMPONENTES
import PageHeader from "@/components/PageHeader";
import SeeMoreBtn from "@/components/SeeMoreBtn";
import Button from "@/components/Button";

// DADOS MOCKADOS
import mockData from "@/assets/mocks/serviceRequests";

// CORES
import Colors from "@/constants/Colors";

const serviceRequests = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);

  const handleSeeMoreBtn = (pedido) => {
    setSelectedPedido(pedido);
    setModalVisible(true);
  };

  const handleAccept = (id) => {
    console.log(`Pedido ${id} aceito`);
    setModalVisible(false);
    // Aqui você implementaria a lógica para aceitar o pedido
  };

  const handleReject = (id) => {
    console.log(`Pedido ${id} rejeitado`);
    setModalVisible(false);
    // Aqui você implementaria a lógica para rejeitar o pedido
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <PageHeader
          title="Pedidos de Serviço"
          containerStyle={{ backgroundColor: Colors.azulClaro }}
          titleStyle={{ color: "#fff" }}
        />
        <ScrollView
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {mockData.map((pedido) => (
              <View key={pedido.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.clientInfo}>
                    <Text style={styles.clientName}>{pedido.cliente.nome}</Text>
                    <Text style={styles.vehicleModel}>
                      {pedido.veiculo.modelo} ({pedido.veiculo.ano})
                    </Text>
                  </View>
                  <Text style={styles.date}>
                    {formatDate(pedido.dataPedido)}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardBody}>
                  <View style={styles.resumoContainer}>
                    <FontAwesome
                      name="wrench"
                      size={18}
                      color={Colors.grafite}
                      style={styles.icon}
                    />
                    <Text style={styles.resumoText}>{pedido.resumo}</Text>
                  </View>

                  <SeeMoreBtn onPress={() => handleSeeMoreBtn(pedido)} />
                </View>
              </View>
            ))}
          </View>

          {/* Modal de detalhes do pedido */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {selectedPedido && (
                  <>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Detalhes do Pedido</Text>
                      <Pressable
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                      >
                        <MaterialIcons name="close" size={24} color="black" />
                      </Pressable>
                    </View>

                    <View style={styles.modalDivider} />

                    <View style={styles.modalClientInfo}>
                      <Text style={styles.modalClientName}>
                        {selectedPedido.cliente.nome}
                      </Text>
                      <Text style={styles.modalClientPhone}>
                        {selectedPedido.cliente.telefone}
                      </Text>
                    </View>

                    <View style={styles.modalVehicleInfo}>
                      <Text style={styles.modalVehicleModel}>
                        <Text style={styles.boldText}>Veículo: </Text>
                        {selectedPedido.veiculo.modelo} (
                        {selectedPedido.veiculo.ano})
                      </Text>
                      <Text style={styles.modalVehiclePlate}>
                        <Text style={styles.boldText}>Placa: </Text>
                        {selectedPedido.veiculo.placa}
                      </Text>
                    </View>

                    <View style={styles.modalContent}>
                      <Text style={styles.modalResumoTitle}>Resumo:</Text>
                      <Text style={styles.modalResumo}>
                        {selectedPedido.resumo}
                      </Text>

                      <Text style={styles.modalDescricaoTitle}>
                        Descrição detalhada:
                      </Text>
                      <Text style={styles.modalDescricao}>
                        {selectedPedido.descricao}
                      </Text>
                    </View>

                    <View style={styles.modalDate}>
                      <Text style={styles.modalDateText}>
                        Pedido realizado em:{" "}
                        {formatDate(selectedPedido.dataPedido)}
                      </Text>
                    </View>

                    <View style={styles.modalActions}>
                      <Button
                        cor={Colors.vermelho}
                        texto="Rejeitar"
                        onPress={() => handleReject(selectedPedido.id)}
                      >
                        <MaterialIcons
                          name="cancel"
                          size={18}
                          color="white"
                          style={{ marginRight: 5 }}
                        />
                      </Button>
                      <Button
                        cor={Colors.verde}
                        texto="Aceitar"
                        onPress={() => handleAccept(selectedPedido.id)}
                      >
                        <MaterialIcons
                          name="check-circle"
                          size={18}
                          color="white"
                          style={{ marginRight: 5 }}
                        />
                      </Button>
                    </View>
                  </>
                )}
              </View>
            </View>
          </Modal>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default serviceRequests;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  vehicleModel: {
    fontSize: 14,
    color: Colors.darkGray,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  resumoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  resumoText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  SeeMoreBtnButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.azulClaro,
    borderRadius: 20,
  },
  SeeMoreBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "DM-Sans",
  },
  // Estilos do Modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.grafite,
    fontFamily: "DM-Sans",
  },
  closeButton: {
    padding: 5,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
  },
  modalClientInfo: {
    marginBottom: 12,
  },
  modalClientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.grafite,
    fontFamily: "DM-Sans",
  },
  modalClientPhone: {
    fontSize: 14,
    color: Colors.grafite,
    marginTop: 2,
    fontFamily: "DM-Sans",
  },
  modalVehicleInfo: {
    marginBottom: 16,
  },
  modalVehicleModel: {
    fontSize: 15,
    color: Colors.grafite,
    fontFamily: "DM-Sans",
  },
  modalVehiclePlate: {
    fontSize: 15,
    color: Colors.text,
    marginTop: 4,
    fontFamily: "DM-Sans",
  },
  boldText: {
    fontWeight: "bold",
  },
  modalContent: {
    marginBottom: 16,
  },
  modalResumoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.grafite,
    marginBottom: 4,
    fontFamily: "DM-Sans",
  },
  modalResumo: {
    fontSize: 16,
    color: Colors.grafite,
    marginBottom: 12,
    fontFamily: "DM-Sans",
  },
  modalDescricaoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
    fontFamily: "DM-Sans",
  },
  modalDescricao: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
    fontFamily: "DM-Sans",
  },
  modalDate: {
    marginBottom: 20,
  },
  modalDateText: {
    fontSize: 14,
    fontStyle: "italic",
    color: Colors.grafite,
    fontFamily: "DM-Sans",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
