import React from "react";
import { TouchableOpacity, Text, View, Alert, StyleSheet } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

// COLORS
import Colors from "@/constants/Colors";

import { FontAwesome5 } from "@expo/vector-icons";

const GeneratePdfBtn = ({ dadosOrdemServico }) => {
  const gerarPDF = async () => {
    const {
      nomeCliente,
      documentoCliente,
      telefoneCliente,
      enderecoCliente,
      cidadeCliente,
      cepCliente,
      marcaVeiculo,
      modeloVeiculo,
      anoVeiculo,
      corVeiculo,
      placaVeiculo,
      quilometragem,
      numeroOS,
      dataServico,
      horaServico,
      produtos,
      servicos,
      totalProdutos,
      totalServicos,
      totalGeral,
      profissionalResponsavel,
      empresaNome,
      empresaCNPJ,
      empresaEndereco,
      empresaTelefone,
      empresaEmail,
    } = dadosOrdemServico;

    const dataAtual = new Date().toLocaleDateString("pt-BR");
    const horaAtual = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const htmlContent = `
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
          background: #333;
          flex: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          padding: 10px;
        }
        .logo {
          color: white;
          font-weight: bold;
          font-size: 14px;
          margin: 0;
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
          <h1 class="logo">TOP CAR</h1>
        </div>
        <div class="company-info">
          <div class="company-name">${empresaNome}</div>
          <div class="ordem-title">ORDEM DE SERVIÇO</div>
          <div class="ordem-number">${numeroOS}</div>
          <div style="font-size: 10px;">
          [SERVIÇO FINALIZADO] Tipo: O.S.<br>
          ${dataServico || dataAtual} - ${horaServico || horaAtual}
          </div>
        </div>
        <div class="contact-info">
          ${empresaNome}<br>
          CNPJ: ${empresaCNPJ}<br>
          ${empresaEndereco}<br>
          E-MAIL: ${empresaEmail}
        </div>
        </div>
        <div class="main-content">
        <div class="left-column">
          <div class="section">
          <div class="section-title">DADOS DO CLIENTE</div>
          <div class="info-row">
            <span class="info-label">Nome:</span>
            <span>${nomeCliente}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Documento:</span>
            <span>${documentoCliente}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Telefone:</span>
            <span>${telefoneCliente}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Endereço:</span>
            <span>${enderecoCliente}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Cidade:</span>
            <span>${cidadeCliente}</span>
          </div>
          <div class="info-row">
            <span class="info-label">CEP:</span>
            <span>${cepCliente}</span>
          </div>
          </div>
        </div>
        <div class="right-column">
          <div style="border: 1px solid #333; padding: 10px; margin-top: 10px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; font-size: 10px;">
            <div>
            <strong>ANO/FAB</strong><br>
            ${anoVeiculo}<br>
            ${anoVeiculo}
            </div>
            <div>
            <strong>MARCA MODELO</strong><br>
            ${marcaVeiculo}<br>
            ${modeloVeiculo}
            </div>
            <div>
            <strong>COR</strong><br>
            ${corVeiculo}
            </div>
            <div>
            <strong>KM-S</strong><br>
            ${quilometragem}
            </div>
          </div>
          <div style="margin-top: 10px; font-size: 10px;">
            <strong>PLACA:</strong> ${placaVeiculo}
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
            ${produtos
            .map(
              (produto) => `
            <tr>
              <td>${produto.codigo}</td>
              <td>${produto.referencia}</td>
              <td class="text-center">${produto.quantidade}</td>
              <td>${produto.unidade}</td>
              <td>${produto.descricao}</td>
              <td class="text-right">R$ ${produto.valorUnitario
              .toFixed(2)
              .replace(".", ",")}</td>
              <td class="text-right">R$ ${produto.valorTotal
              .toFixed(2)
              .replace(".", ",")}</td>
            </tr>
            `
            )
            .join("")}
          </tbody>
          </table>
          <div class="text-right" style="font-weight: bold; font-size: 14px;">
          TOTAL PRODUTOS: R$ ${totalProdutos.toFixed(2).replace(".", ",")}
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
            ${servicos
            .map(
              (servico) => `
            <tr>
              <td>${servico.codigo}</td>
              <td class="text-center">${servico.quantidade}</td>
              <td>${servico.descricao}</td>
              <td class="text-right">R$ ${servico.valorUnitario
              .toFixed(2)
              .replace(".", ",")}</td>
              <td class="text-right">R$ ${servico.valorTotal
              .toFixed(2)
              .replace(".", ",")}</td>
            </tr>
            `
            )
            .join("")}
          </tbody>
          </table>
          <div class="text-right" style="font-weight: bold; font-size: 14px;">
          TOTAL SERVIÇOS: R$ ${totalServicos.toFixed(2).replace(".", ",")}
          </div>
        </div>
        </div>
        <div class="totals">
        <div class="totals-box">
          <div class="total-row">
          <span>TOTAL DE PRODUTOS:</span>
          <span>R$ ${totalProdutos.toFixed(2).replace(".", ",")}</span>
          </div>
          <div class="total-row">
          <span>TOTAL DE SERVIÇOS:</span>
          <span>R$ ${totalServicos.toFixed(2).replace(".", ",")}</span>
          </div>
          <div class="total-row final">
          <span>TOTAL GERAL:</span>
          <span>R$ ${totalGeral.toFixed(2).replace(".", ",")}</span>
          </div>
          <div style="margin-top: 15px; font-size: 10px;">
          <strong>Profissional Responsável:</strong><br>
          ${profissionalResponsavel}
          </div>
        </div>
        </div>
        <div class="signature-section">
        <p style="margin-top: 30px; font-size: 11px;">
          <strong>Autorizo a execução dos serviços acima mencionados</strong>
        </p>
        <div class="signature-line"></div>
        <div style="font-size: 11px; margin-top: 5px;">
          <strong>${nomeCliente.toUpperCase()}</strong><br>
          Assinatura do cliente ou pessoa por ele autorizada
        </div>
        <div style="margin-top: 30px; font-size: 10px;">
          Gerado por: SISTEMA TOPCAR em ${dataAtual} às ${horaAtual}
        </div>
        </div>
      </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      // const nomeArquivo = `OS_${dadosCliente.numeroOS}_${dadosCliente.nomeCliente.replace(/\s+/g, '_')}.pdf`;

      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Compartilhar Ordem de Serviço",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      Alert.alert("Erro", "Não foi possível gerar o PDF");
    }
  };

  return (
    <TouchableOpacity
      style={[styles.actionButton, styles.noteButton]}
      onPress={gerarPDF}
    >
      <FontAwesome5 name="file-alt" size={18} color="#FFF" />
      <Text style={styles.actionButtonText}>Nova Nota</Text>
    </TouchableOpacity>
  );
};

export default GeneratePdfBtn;

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
