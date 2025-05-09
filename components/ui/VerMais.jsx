import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import Colors from '@/constants/Colors';
import { TouchableHighlight } from 'react-native';

const VerMais = () => {
  return (
    <View>
        <TouchableHighlight style={styles.container}>
            <Text style={styles.texto}>Ver mais +</Text>
        </TouchableHighlight>
    </View>
  );
};

export default VerMais;

const styles = StyleSheet.create({
    container: {
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 24,
        paddingVertical: 2
    },
    texto: {
        fontSize: 16,
        color: Colors.azulClaro,
        fontWeight: 'bold',
        fontFamily: 'DM-Sans'
    }
});