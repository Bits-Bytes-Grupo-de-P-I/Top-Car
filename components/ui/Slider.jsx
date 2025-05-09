import { StyleSheet, View, TouchableHighlight, Animated } from "react-native";
import { useState, useEffect } from "react";
import Colors from "@/constants/Colors";

const Slider = () => {
  const [state, setState] = useState(false);
  const [sliderPosition, setSliderPosition] = useState("flex-start");

  // Criar uma variável animada para a posição do slider
  const position = useState(new Animated.Value(0))[0]; // Começa em 0 (flex-start)

  useEffect(() => {
    // Usando o hook useEffect pra disparar a animação
    Animated.timing(position, {
      toValue: sliderPosition === "flex-end" ? 40 : 0, // 40px é a distância que o slider se moverá
      duration: 150, // Duração da animação em milissegundos
    }).start();
  }, [sliderPosition]); // O efeito é disparado sempre que sliderPosition mudar

  return (
    <View>
      <TouchableHighlight
        underlayColor={Colors.aluminio}
        style={[
          styles.container,
          styles.position,
          { underlayColor: "transparent" },
        ]}
        onPress={() => {
          setSliderPosition(
            sliderPosition === "flex-start" ? "flex-end" : "flex-start"
          );
          setState(!state); // Alterna a cor
        }}
      >
        <Animated.View
          style={[
            styles.slider,
            {
              backgroundColor: state ? Colors.verde : Colors.vermelho,
              transform: [{ translateX: position }], // Aplica a animação de de mover no eixo X
            },
          ]}
        ></Animated.View>
      </TouchableHighlight>
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: "white",
    width: 80,
    height: 40,
    justifyContent: "center",
    margin: 10,
  },
  slider: {
    width: 40,
    height: 40,
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
