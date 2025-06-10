// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   SafeAreaView,
//   ScrollView,
//   ActivityIndicator
// } from 'react-native';
// import * as Print from 'expo-print';
// import * as MediaLibrary from 'expo-media-library';
// import * as Sharing from 'expo-sharing';

// export default function testePdf() {
//   const [isGenerating, setIsGenerating] = useState(false);

//   // Função para salvar na galeria (sua função original)
//   const saveToGallery = async () => {
//     setIsGenerating(true);
//     try {
//       // Solicitar permissões
//       const { status } = await MediaLibrary.requestPermissionsAsync();
      
//       if (status !== 'granted') {
//         Alert.alert('Erro', 'Permissão negada para salvar arquivos');
//         return;
//       }

//       // Gerar PDF
//       const html = `
//         <html>
//           <head>
//             <style>
//               body { 
//                 font-family: Arial, sans-serif; 
//                 margin: 40px;
//                 line-height: 1.6;
//                 color: #333;
//               }
//               .header { 
//                 text-align: center; 
//                 color: #2c3e50;
//                 border-bottom: 3px solid #3498db;
//                 padding-bottom: 20px;
//                 margin-bottom: 30px;
//               }
//               .content { 
//                 margin-top: 20px; 
//               }
//               .highlight {
//                 background-color: #f8f9fa;
//                 padding: 15px;
//                 border-left: 4px solid #3498db;
//                 margin: 15px 0;
//               }
//             </style>
//           </head>
//           <body>
//             <div class="header">
//               <h1>PDF Salvo na Galeria</h1>
//               <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
//             </div>
//             <div class="content">
//               <h2>Conteúdo do Teste</h2>
//               <p>Este arquivo foi salvo automaticamente na sua galeria!</p>
//               <div class="highlight">
//                 <strong>Sucesso!</strong> O PDF foi gerado e salvo com sucesso usando React Native Expo.
//               </div>
//               <h3>Informações do Dispositivo</h3>
//               <p>Data de criação: ${new Date().toString()}</p>
//               <p>Status: Arquivo salvo na galeria do dispositivo</p>
//             </div>
//           </body>
//         </html>
//       `;

//       const { uri } = await Print.printToFileAsync({ 
//         html,
//         width: 612,
//         height: 792,
//       });

//       // Salvar na galeria
//       const asset = await MediaLibrary.createAssetAsync(uri);
//       await MediaLibrary.createAlbumAsync('Meus PDFs', asset, false);
      
//       Alert.alert('Sucesso', 'PDF salvo na galeria!');
//     } catch (error) {
//       console.error('Erro ao salvar PDF:', error);
//       Alert.alert('Erro', 'Não foi possível salvar o PDF');
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // Função alternativa para compartilhar (mais simples)
//   const shareAsPDF = async () => {
//     setIsGenerating(true);
//     try {
//       const html = `
//         <html>
//           <head>
//             <style>
//               body { 
//                 font-family: Arial, sans-serif; 
//                 margin: 40px;
//                 line-height: 1.6;
//                 color: #333;
//               }
//               .header { 
//                 text-align: center; 
//                 color: #2c3e50;
//                 border-bottom: 3px solid #e74c3c;
//                 padding-bottom: 20px;
//                 margin-bottom: 30px;
//               }
//             </style>
//           </head>
//           <body>
//             <div class="header">
//               <h1>PDF Compartilhado</h1>
//               <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
//             </div>
//             <div class="content">
//               <h2>PDF para Compartilhamento</h2>
//               <p>Eu sou um programador inútil :(</p>
//             </div>
//           </body>
//         </html>
//       `;

//       const { uri } = await Print.printToFileAsync({ html });
      
//       // Compartilhar o PDF
//       await Sharing.shareAsync(uri, {
//         mimeType: 'application/pdf',
//         dialogTitle: 'Compartilhar PDF'
//       });
//     } catch (error) {
//       console.error('Erro ao compartilhar PDF:', error);
//       Alert.alert('Erro', 'Não foi possível compartilhar o PDF');
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.header}>
//           <Text style={styles.title}>📄 Gerador de PDF</Text>
//           <Text style={styles.subtitle}>Teste as funcionalidades de PDF</Text>
//         </View>

//         <View style={styles.buttonsContainer}>
//           <TouchableOpacity
//             style={[styles.button, styles.primaryButton]}
//             onPress={saveToGallery}
//             disabled={isGenerating}
//           >
//             <View style={styles.buttonContent}>
//               {isGenerating ? (
//                 <ActivityIndicator color="white" size="small" />
//               ) : (
//                 <Text style={styles.buttonIcon}>💾</Text>
//               )}
//               <Text style={styles.buttonText}>
//                 {isGenerating ? 'Salvando...' : 'Salvar na Galeria'}
//               </Text>
//               <Text style={styles.buttonSubtext}>
//                 Salva automaticamente na galeria do dispositivo
//               </Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.button, styles.secondaryButton]}
//             onPress={shareAsPDF}
//             disabled={isGenerating}
//           >
//             <View style={styles.buttonContent}>
//               {isGenerating ? (
//                 <ActivityIndicator color="white" size="small" />
//               ) : (
//                 <Text style={styles.buttonIcon}>📤</Text>
//               )}
//               <Text style={styles.buttonText}>
//                 {isGenerating ? 'Gerando...' : 'Compartilhar PDF'}
//               </Text>
//               <Text style={styles.buttonSubtext}>
//                 Abre o menu de compartilhamento
//               </Text>
//             </View>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.infoContainer}>
//           <Text style={styles.infoTitle}>ℹ️ Informações:</Text>
//           <Text style={styles.infoText}>
//             • Teste primeiro em um dispositivo físico{'\n'}
//             • A primeira opção salva diretamente na galeria{'\n'}
//             • A segunda opção permite escolher onde salvar{'\n'}
//             • Verifique as permissões se houver erro
//           </Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   scrollContent: {
//     padding: 20,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 40,
//     paddingTop: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 5,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#7f8c8d',
//     textAlign: 'center',
//   },
//   buttonsContainer: {
//     marginBottom: 30,
//   },
//   button: {
//     borderRadius: 12,
//     marginBottom: 15,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   primaryButton: {
//     backgroundColor: '#3498db',
//   },
//   secondaryButton: {
//     backgroundColor: '#2ecc71',
//   },
//   buttonContent: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   buttonIcon: {
//     fontSize: 24,
//     marginBottom: 8,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 5,
//   },
//   buttonSubtext: {
//     color: 'rgba(255, 255, 255, 0.8)',
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   infoContainer: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 12,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//   },
//   infoTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 10,
//   },
//   infoText: {
//     fontSize: 14,
//     color: '#34495e',
//     lineHeight: 20,
//   },
// });