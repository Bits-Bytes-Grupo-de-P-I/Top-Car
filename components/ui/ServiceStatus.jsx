import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

const ServiceStatus = () => {
  const data = [
    { label: "Em Andamento", value: "1" },
    { label: "Aguardando Peça", value: "2" },
    { label: "Finalizado", value: "3" },
  ];
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const getIconColor = () => {
    switch (value) {
      case "1": // Em Andamento
        return Colors.azulClaro;
      case "2": // Aguardando Peça
        return Colors.laranja;
      case "3": // Finalizado
        return Colors.verde;
      default: // Nenhum selecionado
        return Colors.grafite;
    }
  };

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
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
        }}
        renderLeftIcon={() => (
          <View style={[styles.icon, { backgroundColor: getIconColor() }]} />
        )}
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
  icon: {
    width: 15,
    height: 15,
    borderRadius: 15,
    marginRight: 10,
  },
});
