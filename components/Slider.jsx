import { StyleSheet, View, TouchableOpacity, Animated } from "react-native";
import { useState, useEffect } from "react";

// CORES
import Colors from "@/constants/Colors";

const Slider = ({ value, onChange, onPress }) => {
  const [state, setState] = useState(value || false);
  const [sliderPosition, setSliderPosition] = useState("flex-start");
  // Criar uma variável animada para a posição do slider
  const position = useState(new Animated.Value(0))[0]; // Começa em 0 (flex-start)

  useEffect(() => {
    Animated.timing(position, {
      toValue: sliderPosition === "flex-end" ? 30 : 0, // 30px
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [sliderPosition]); // O efeito é disparado sempre que sliderPosition mudar

  return (
    <View>
      <TouchableOpacity
        underlayColor={Colors.aluminio}
        style={[
          styles.container,
          styles.position,
          { underlayColor: "transparent" },
        ]}
        onPress={() => {
          const newState = !state;
          const newPosition = newState ? "flex-end" : "flex-start";
          setSliderPosition(newPosition);
          setState(newState);

          // Notificar o componente pai sobre a mudança
          if (onChange) {
            onChange(newState);
          }

          // Executar a função onPress adicional se fornecida
          if (onPress) {
            onPress();
          }
        }}
      >
        <Animated.View
          style={[
            styles.slider,
            {
              backgroundColor: state ? Colors.verde : Colors.vermelho,
              transform: [{ translateX: position }], // Aplica a animação de mover no eixo X
            },
          ]}
        ></Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.grafite,
    backgroundColor: "white",
    width: 60,
    height: 30,
    justifyContent: "center",
    margin: 10,
  },
  slider: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 40,
    backgroundColor: "black",
    position: "absolute", // Se não tiver isso aqui o slider num vai naum
  },
  position: {
    position: "relative", // Se não tiver isso aqui o slider num vai naum
  },
});
