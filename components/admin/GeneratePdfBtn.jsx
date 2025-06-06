import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// If you use FontAwesome5 and Colors, import them here:
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '../../constants/Colors'; // Adjust the path as needed

export default function GeneratePdfBtn() {
  // Function to generate and share PDF
  const shareAsPDF = async () => {
    try {
      const html = `
        <html>
          <head>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 40px;
                line-height: 1.6;
                color: #333;
              }
              .header { 
                text-align: center; 
                color: #2c3e50;
                border-bottom: 3px solid #e74c3c;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>PDF Compartilhado</h1>
              <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            <div class="content">
              <h2>PDF para Compartilhamento</h2>
              <p>Eu sou um programador inútil :(</p>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });

      // Share the PDF
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartilhar PDF'
      });
    } catch (error) {
      console.error('Erro ao compartilhar PDF:', error);
      Alert.alert('Erro', 'Não foi possível compartilhar o PDF');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.actionButton, styles.noteButton]}
      onPress={shareAsPDF}
    >
      <FontAwesome5 name="file-alt" size={18} color="#FFF" />
      <Text style={styles.actionButtonText}>Nova Nota</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: Colors.azul,
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 10,
  },
  noteButton: {
    backgroundColor: Colors.verde,
    marginRight: 0,
  },
  actionButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 10,
    fontSize: 15,
    fontFamily: "DM-Sans",
  },
});