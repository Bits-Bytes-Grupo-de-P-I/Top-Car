import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useState } from "react";
import Colors from "@/constants/Colors";

const BillVehicleDropdown = ({
  vehicles = [],            // lista de veículos
  selectedVehicleId = null, // id do veículo selecionado
  onVehicleChange,          // callback quando muda
}) => {
  const [isFocus, setIsFocus] = useState(false);

  // transforma vehicles em array para o Dropdown
  const data = vehicles.map((v) => ({
    label: `${v.marca} ${v.modelo} (${v.ano}) - ${v.placa}`,
    value: v.id,
    vehicle: v,
  }));

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: Colors.azul }]}
        placeholder={!isFocus ? "Selecione um veículo" : "..."}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={data}
        maxHeight={250}
        labelField="label"
        valueField="value"
        value={selectedVehicleId}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setIsFocus(false);
          onVehicleChange(item.vehicle);
        }}
      />
    </View>
  );
};

export default BillVehicleDropdown;

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  dropdown: {
    height: 50,
    borderColor: Colors.aluminio,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    fontSize: 16,
    color: Colors.grafite,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: Colors.grafite,
  },
});
