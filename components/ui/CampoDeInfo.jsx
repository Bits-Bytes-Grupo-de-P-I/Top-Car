import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'

const CampoDeInfo = (props) => {

  return (
    <View style={{marginBottom: 16}}>
      <Text style={styles.tituloCampo}>{props.tipoDeInfo}</Text>
      <TextInput style={[styles.campo, styles.tamanhoCampo]}></TextInput>
    </View>
  )
}

export default CampoDeInfo

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flex: 1
    },
    tituloCampo: {
        fontSize: 20,
        marginBottom: 4,
        color: 'white'
    },
    campo: {
        borderRadius: 5,
        backgroundColor: 'white',
        fontSize: 16,
        color: 'black',
        paddingLeft: 8
    },
    tamanhoCampo: {
        width: 316
    }
})