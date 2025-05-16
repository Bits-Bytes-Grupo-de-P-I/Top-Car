import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";

import Colors from "@/constants/Colors";

const Dropdown = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isOpen ? contentHeight : 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isOpen, contentHeight]);

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.dropdown, { height: animatedHeight }]}>
        {/* Medir o conteúdo e armazenar altura apenas uma vez */}
        <View
          style={styles.innerContent}
          onLayout={(event) => {
            const height = event.nativeEvent.layout.height;
            if (height !== contentHeight) {
              setContentHeight(height);
            }
          }}
        >
          {children}
        </View>
      </Animated.View>
    </>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  dropdown: {
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
  },
  innerContent: {
    padding: 16,
    position: "absolute", // Posicionar fora do fluxo normal para medir sem ocupar espaço
    top: 0,
    left: 0,
    right: 0,
  },
});
