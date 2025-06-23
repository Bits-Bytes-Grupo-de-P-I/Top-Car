import { StyleSheet, View, Alert } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useState, useEffect } from "react";
// CORES
import Colors from "@/constants/Colors";

const ServiceStatus = ({ item, fetchServicos, onStatusUpdate }) => {
  const data = [
    { label: "Em Andamento", value: "em andamento" },
    { label: "Aguardando Peça", value: "aguardando_peca" },
    { label: "Concluído", value: "concluido" },
  ];

  useEffect(() => {
    console.log(">> Status inicial do item:", item.status);
    setValue(item?.status || null);
  }, [item?.status]);

  const [value, setValue] = useState(item?.status || null);
  const [isFocus, setIsFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Constantes da API
  const API_BASE_URL = "https://topcar-back-end.onrender.com";
  const AUTH_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJqb2FvQGV4YW1wbGUuY29tIiwiZnVuY2FvIjoiYWRtaW4iLCJpYXQiOjE3NDg0NTQzODR9.3fxamj4FEzv265boICnC3WqcJZLiJ0Kfsmbpg9S9lFs";

  // Função para fazer requisições HTTP
  const makeRequest = async (url, options = {}) => {
    console.log(">>>> makeRequest chamado com:", url, options);
    try {
      const response = await fetch(url, {
        // **IMPORTANT**: coloque **primeiro** os headers fixos
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
          ...options.headers,
        },
        ...options, // aqui entram method, body, etc.
      });

      const text = await response.text();
      let body;
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
      if (!response.ok) {
        console.error(`HTTP ${response.status}:`, body);
        throw new Error(body.details || JSON.stringify(body));
      }
      return body;
    } catch (err) {
      console.error("Erro na requisição:", err);
      throw err;
    }
  };

  const ALLOWED_STATUSES = ["em andamento", "aguardando_peca", "concluido"];

  const updatePedidoStatus = async (newStatus) => {
    setIsLoading(true);
    try {
      // Primeiro: buscar dados atuais do pedido
      const pedidoAtual = await makeRequest(
        `${API_BASE_URL}/pedidos/${item.id}`,
        {
          method: "GET",
        }
      );

      const payload = {
        cliente_id: pedidoAtual.cliente_id,
        veiculo_id: pedidoAtual.veiculo_id,
        resumo: pedidoAtual.resumo || "",
        descricao: pedidoAtual.descricao || "",
        dataPedido: "2026-01-01",
        status: newStatus, // novo status
      };

      console.log(">> Enviando atualização:", payload);

      const updatedPedido = await makeRequest(
        `${API_BASE_URL}/pedidos/${item.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      if (onStatusUpdate) {
        onStatusUpdate(item.id, updatedPedido.status);
      } else {
        fetchServicos();
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      Alert.alert("Erro", error.message || "Não foi possível atualizar");
      setValue(item?.status || null);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconColor = () => {
    switch (value) {
      case "em andamento": // Em Andamento
        return Colors.azulClaro;
      case "aguardando_peca": // Aguardando Peça
        return Colors.laranja;
      case "concluido": // concluido
        return Colors.verde;
      default: // Nenhum selecionado
        return Colors.grafite;
    }
  };

  useEffect(() => {
    setValue(item?.status || null);
  }, [item?.status]);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[
          styles.dropdown,
          isFocus && { borderColor: "blue" },
          isLoading && { opacity: 0.6 },
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Selecione um status" : "..."}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
          updatePedidoStatus(item.value);
        }}
        renderLeftIcon={() => (
          <View style={[styles.icon, { backgroundColor: getIconColor() }]} />
        )}
        disable={isLoading}
      />
    </View>
  );
};

export default ServiceStatus;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    flex: 1,
  },
  dropdown: {
    flex: 1,
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    width: 15,
    height: 15,
    borderRadius: 15,
    marginRight: 10,
  },
});
