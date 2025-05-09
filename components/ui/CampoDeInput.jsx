import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'

const CampoDeInput = (props) => {

  return (
    <View style={styles.container}>
      <Text style={styles.tituloCampo}>{props.tipoDeInfo}</Text>
      <TextInput style={[styles.campo, styles.tamanhoCampo]}></TextInput>
    </View>
  )
}

export default CampoDeInput

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
        height: 32,
        marginBottom: 32
    },
    tituloCampo: {
        fontSize: 20,
        marginBottom: 4,
        color: 'white',
        fontFamily: 'DM-Sans'
    },
    campo: {
        borderRadius: 5,
        backgroundColor: 'white',
        fontSize: 16,
        color: 'black',
        paddingLeft: 8,
    },
    tamanhoCampo: {
        width: '100%'
    }
})