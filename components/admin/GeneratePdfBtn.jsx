import React from "react";
import { Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

// If you use FontAwesome5 and Colors, import them here:
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "../../constants/Colors"; // Adjust the path as needed

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
      margin: 20px;
      line-height: 1.4;
      color: #333;
      font-size: 12px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      border-bottom: 2px solid #333;
      padding-bottom: 15px;
    }
    
    .logo-section {
      flex: 1;
    }
    
    .logo {
      background: #333;
      color: white;
      padding: 8px 15px;
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 10px;
      display: inline-block;
    }
    
    .company-info {
      flex: 2;
      text-align: center;
    }
    
    .company-name {
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 5px;
    }
    
    .ordem-title {
      font-size: 16px;
      font-weight: bold;
      margin: 10px 0;
    }
    
    .ordem-number {
      font-size: 18px;
      font-weight: bold;
      margin: 5px 0;
    }
    
    .contact-info {
      flex: 1;
      text-align: right;
      font-size: 10px;
    }
    
    .main-content {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .left-column {
      flex: 1;
    }
    
    .right-column {
      flex: 1;
    }
    
    .section {
      margin-bottom: 15px;
      border: 1px solid #ddd;
      padding: 10px;
    }
    
    .section-title {
      font-weight: bold;
      background: #f5f5f5;
      margin: -10px -10px 10px -10px;
      padding: 8px 10px;
      border-bottom: 1px solid #ddd;
    }
    
    .info-row {
      display: flex;
      margin-bottom: 5px;
    }
    
    .info-label {
      font-weight: bold;
      min-width: 100px;
      margin-right: 10px;
    }
    
    .vehicle-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .vehicle-box {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: center;
    }
    
    .vehicle-label {
      font-weight: bold;
      font-size: 10px;
      margin-bottom: 5px;
    }
    
    .products-services {
      margin-top: 20px;
    }
    
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }
    
    .table th,
    .table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    
    .table th {
      background: #f5f5f5;
      font-weight: bold;
      font-size: 11px;
    }
    
    .table td {
      font-size: 11px;
    }
    
    .text-right {
      text-align: right;
    }
    
    .text-center {
      text-align: center;
    }
    
    .totals {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
    
    .totals-box {
      border: 2px solid #333;
      padding: 15px;
      min-width: 250px;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 5px 0;
    }
    
    .total-row.final {
      border-top: 2px solid #333;
      font-weight: bold;
      font-size: 14px;
      margin-top: 10px;
      padding-top: 10px;
    }
    
    .signature-section {
      margin-top: 30px;
      text-align: center;
    }
    
    .signature-line {
      border-top: 1px solid #333;
      margin: 30px auto 5px auto;
      width: 300px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-section">
      <div class="logo">TOP CAR</div>
      <div style="font-size: 10px;">
        <strong>CLIENTE</strong><br>
        LEONARDO<br>
        ENDEREÇO
      </div>
    </div>
    
    <div class="company-info">
      <div class="company-name">AUTO MECÂNICA TOPCAR LTDA</div>
      <div class="ordem-title">ORDEM DE SERVIÇO</div>
      <div class="ordem-number">1839</div>
      <div style="font-size: 10px;">
        [SERVIÇO FINALIZADO] Tipo: O.S.<br>
        ${new Date().toLocaleDateString(
          "pt-BR"
        )} - ${new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })}
      </div>
    </div>
    
    <div class="contact-info">
      AUTO MECÂNICA TOPCAR LTDA<br>
      CNPJ: 39.344.578/0001-24<br>
      AV ENG. ELI PINHEIRO, 1059<br>
      BAIRRO PRETO<br>
      PRESIDENTE OLEGÁRIO/MG - 38.750-000<br>
      FONE:<br>
      E-MAIL: topcarpo@hotmail.com
    </div>
  </div>

  <div class="main-content">
    <div class="left-column">
      <div class="section">
        <div class="section-title">DADOS DO CLIENTE</div>
        <div class="info-row">
          <span class="info-label">Nome:</span>
          <span>João Silva</span>
        </div>
        <div class="info-row">
          <span class="info-label">Documento:</span>
          <span>123.456.789-00</span>
        </div>
        <div class="info-row">
          <span class="info-label">Telefone:</span>
          <span>(11) 98765-4321</span>
        </div>
        <div class="info-row">
          <span class="info-label">Endereço:</span>
          <span>Rua das Flores, 123 - Centro</span>
        </div>
        <div class="info-row">
          <span class="info-label">Cidade:</span>
          <span>São Paulo - SP</span>
        </div>
        <div class="info-row">
          <span class="info-label">CEP:</span>
          <span>12345-678</span>
        </div>
      </div>
    </div>
    
    <div class="right-column">
      <div class="vehicle-info">
        <div class="vehicle-box">
          <div class="vehicle-label">CÓDIGO</div>
          <div>1380</div>
        </div>
        <div class="vehicle-box">
          <div class="vehicle-label">CPF/CNPJ</div>
          <div>000.000.000-00</div>
        </div>
        <div class="vehicle-box">
          <div class="vehicle-label">RG/IE</div>
          <div></div>
        </div>
        <div class="vehicle-box">
          <div class="vehicle-label">ESTADO</div>
          <div></div>
        </div>
      </div>
      
      <div style="border: 1px solid #333; padding: 10px; margin-top: 10px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; font-size: 10px;">
          <div>
            <strong>ANO/FAB</strong><br>
            2022<br>
            2022
          </div>
          <div>
            <strong>MARCA MODELO</strong><br>
            RENAULT<br>
            KWID ZEN
          </div>
          <div>
            <strong>COR</strong><br>
            BRANCA
          </div>
          <div>
            <strong>KM-S</strong><br>
            15.000
          </div>
        </div>
        <div style="margin-top: 10px; font-size: 10px;">
          <strong>PLACA:</strong> ABC1D23
        </div>
      </div>
    </div>
  </div>

  <div class="products-services">
    <div class="section">
      <div class="section-title">PRODUTOS</div>
      <table class="table">
        <thead>
          <tr>
            <th>Cód</th>
            <th>Ref</th>
            <th>Qtd</th>
            <th>Unidade</th>
            <th>Descrição</th>
            <th class="text-right">R$ Unit</th>
            <th class="text-right">R$ Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>7193</td>
            <td>51907364</td>
            <td class="text-center">1</td>
            <td>UN</td>
            <td>FILTRO DE ÓLEO</td>
            <td class="text-right">R$ 25,00</td>
            <td class="text-right">R$ 25,00</td>
          </tr>
          <tr>
            <td>7194</td>
            <td>XGB360349AA</td>
            <td class="text-center">4</td>
            <td>UN</td>
            <td>VELA DE IGNIÇÃO</td>
            <td class="text-right">R$ 15,00</td>
            <td class="text-right">R$ 60,00</td>
          </tr>
          <tr>
            <td>7195</td>
            <td>-</td>
            <td class="text-center">5</td>
            <td>LT</td>
            <td>ÓLEO DO MOTOR 5W30</td>
            <td class="text-right">R$ 18,00</td>
            <td class="text-right">R$ 90,00</td>
          </tr>
        </tbody>
      </table>
      <div class="text-right" style="font-weight: bold; font-size: 14px;">
        TOTAL PRODUTOS: R$ 175,00
      </div>
    </div>

    <div class="section">
      <div class="section-title">SERVIÇOS</div>
      <table class="table">
        <thead>
          <tr>
            <th>Cód</th>
            <th>Qtd</th>
            <th>Descrição</th>
            <th class="text-right">R$ Unit</th>
            <th class="text-right">R$ Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>001</td>
            <td class="text-center">1</td>
            <td>TROCA DE ÓLEO E FILTRO</td>
            <td class="text-right">R$ 80,00</td>
            <td class="text-right">R$ 80,00</td>
          </tr>
          <tr>
            <td>002</td>
            <td class="text-center">1</td>
            <td>TROCA DE VELAS</td>
            <td class="text-right">R$ 40,00</td>
            <td class="text-right">R$ 40,00</td>
          </tr>
        </tbody>
      </table>
      <div class="text-right" style="font-weight: bold; font-size: 14px;">
        TOTAL SERVIÇOS: R$ 120,00
      </div>
    </div>
  </div>

  <div class="totals">
    <div class="totals-box">
      <div class="total-row">
        <span>TOTAL DE PRODUTOS:</span>
        <span>R$ 175,00</span>
      </div>
      <div class="total-row">
        <span>TOTAL DE SERVIÇOS:</span>
        <span>R$ 120,00</span>
      </div>
      <div class="total-row final">
        <span>TOTAL GERAL:</span>
        <span>R$ 295,00</span>
      </div>
      <div style="margin-top: 15px; font-size: 10px;">
        <strong>Profissional Responsável:</strong><br>
        DIEGO WALLANS RIBEIRO
      </div>
    </div>
  </div>

  <div class="signature-section">
    <p style="margin-top: 30px; font-size: 11px;">
      <strong>Autorizo a execução dos serviços acima mencionados</strong>
    </p>
    
    <div class="signature-line"></div>
    <div style="font-size: 11px; margin-top: 5px;">
      <strong>JOÃO SILVA</strong><br>
      Assinatura do cliente ou pessoa por ele autorizada
    </div>
    
    <div style="margin-top: 30px; font-size: 10px;">
      Gerado por: SISTEMA TOPCAR em ${new Date().toLocaleDateString(
        "pt-BR"
      )} às ${new Date().toLocaleTimeString("pt-BR")}
    </div>
  </div>
</body>
</html>
      `;

      const { uri } = await Print.printToFileAsync({ html });

      // Share the PDF
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Compartilhar PDF",
      });
    } catch (error) {
      console.error("Erro ao compartilhar PDF:", error);
      Alert.alert("Erro", "Não foi possível compartilhar o PDF");
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
