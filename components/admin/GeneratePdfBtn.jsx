import React from "react";
import {
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
} from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

// COLORS
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const GeneratePdfBtn = ({ dadosOrdemServico }) => {
  const gerarPDF = async () => {
    try {
      // Verificar se os dados existem
      if (!dadosOrdemServico) {
        Alert.alert("Erro", "Dados da ordem de serviço não encontrados");
        return;
      }

      const {
        cliente = {},
        veiculo = {},
        produtos = [],
        servicos = [],
      } = dadosOrdemServico;

      // Gerar número da OS
      const numeroOS = `OS-${Date.now().toString().slice(-6)}`;

      // Dados da empresa
      const empresaInfo = {
        nome: "TOP CAR",
        cnpj: "12.345.678/0001-90",
        endereco: "Rua das Oficinas, 123 - Centro",
        telefone: "(11) 99999-9999",
        email: "contato@topcar.com.br"
      };

      // Extrair dados do cliente
      const {
        nome: nomeCliente = "Nome não informado",
        documento: documentoCliente = "Documento não informado",
        telefone: telefoneCliente = "Telefone não informado",
        endereco: enderecoCliente = "Endereço não informado",
        cidade: cidadeCliente = "Cidade não informada",
        cep: cepCliente = "CEP não informado",
      } = cliente;

      // Extrair dados do veículo
      const {
        marca: marcaVeiculo = "Marca não informada",
        modelo: modeloVeiculo = "Modelo não informado",
        ano: anoVeiculo = "Ano não informado",
        cor: corVeiculo = "Cor não informada",
        placa: placaVeiculo = "Placa não informada",
        km: quilometragem = "KM não informado",
      } = veiculo || {};

      // Calcular totais
      const calcularTotalProdutos = () => {
        return produtos.reduce((total, produto) => {
          const valorUnit = Number(produto.valorunitario || 0);
          const quantidade = Number(produto.quantidade || 0);
          return total + (quantidade * valorUnit);
        }, 0);
      };

      const calcularTotalServicos = () => {
        return servicos.reduce((total, servico) => {
          const valorMao = Number(servico.valor_mao_de_obra || 0);
          return total + valorMao;
        }, 0);
      };

      const totalProdutos = calcularTotalProdutos();
      const totalServicos = calcularTotalServicos();
      const totalGeral = totalProdutos + totalServicos;

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
      .left-column, .right-column {
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
      .products-services {
        margin-top: 20px;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
      }
      .table th, .table td {
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
      .empty-message {
        text-align: center;
        color: #666;
        font-style: italic;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="logo-section">
        <h1 class="logo">TOP CAR</h1>
      </div>
      <div class="company-info">
        <div class="company-name">${empresaInfo.nome}</div>
        <div class="ordem-title">ORDEM DE SERVIÇO</div>
        <div class="ordem-number">${numeroOS}</div>
      </div>
      <div class="contact-info">
        ${empresaInfo.nome}<br>
        CNPJ: ${empresaInfo.cnpj}<br>
        ${empresaInfo.endereco}<br>
        Tel: ${empresaInfo.telefone}<br>
        E-MAIL: ${empresaInfo.email}
      </div>
    </div>

    <div class="main-content">
      <div class="left-column">
        <div class="section">
          <div class="section-title">DADOS DO CLIENTE</div>
          <div class="info-row"><span class="info-label">Nome:</span><span>${nomeCliente}</span></div>
          <div class="info-row"><span class="info-label">Documento:</span><span>${documentoCliente}</span></div>
          <div class="info-row"><span class="info-label">Telefone:</span><span>${telefoneCliente}</span></div>
          <div class="info-row"><span class="info-label">Endereço:</span><span>${enderecoCliente}</span></div>
          <div class="info-row"><span class="info-label">Cidade:</span><span>${cidadeCliente}</span></div>
          <div class="info-row"><span class="info-label">CEP:</span><span>${cepCliente}</span></div>
        </div>
      </div>
      <div class="right-column">
        <div class="section">
          <div class="section-title">DADOS DO VEÍCULO</div>
          <div class="info-row"><span class="info-label">Marca:</span><span>${marcaVeiculo}</span></div>
          <div class="info-row"><span class="info-label">Modelo:</span><span>${modeloVeiculo}</span></div>
          <div class="info-row"><span class="info-label">Ano:</span><span>${anoVeiculo}</span></div>
          <div class="info-row"><span class="info-label">Cor:</span><span>${corVeiculo}</span></div>
          <div class="info-row"><span class="info-label">Placa:</span><span>${placaVeiculo}</span></div>
          <div class="info-row"><span class="info-label">KM:</span><span>${quilometragem}</span></div>
        </div>
      </div>
    </div>

    <div class="products-services">
      <div class="section">
        <div class="section-title">PRODUTOS</div>
        ${produtos.length > 0 ? `
        <table class="table">
          <thead>
            <tr>
              <th>Cód</th>
              <th>Qtd</th>
              <th>Unid</th>
              <th>Descrição</th>
              <th class="text-right">R$ Unit</th>
              <th class="text-right">R$ Total</th>
            </tr>
          </thead>
          <tbody>
            ${produtos
              .map(
                (produto, index) => {
                  const valorUnit = Number(produto.valorunitario || 0);
                  const quantidade = Number(produto.quantidade || 0);
                  const valorTotal = quantidade * valorUnit;
                  return `
                  <tr>
                    <td>${produto.id || `P${index + 1}`}</td>
                    <td class="text-center">${quantidade}</td>
                    <td>${produto.unidade || 'UN'}</td>
                    <td>${produto.nome || 'Produto sem nome'}</td>
                    <td class="text-right">R$ ${valorUnit.toFixed(2).replace(".", ",")}</td>
                    <td class="text-right">R$ ${valorTotal.toFixed(2).replace(".", ",")}</td>
                  </tr>
                `;
                }
              )
              .join("")}
          </tbody>
        </table>
        ` : '<div class="empty-message">Nenhum produto adicionado</div>'}
      </div>

      <div class="section">
        <div class="section-title">SERVIÇOS</div>
        ${servicos.length > 0 ? `
        <table class="table">
          <thead>
            <tr>
              <th>Cód</th>
              <th>Descrição</th>
              <th class="text-right">R$ Total</th>
            </tr>
          </thead>
          <tbody>
            ${servicos
              .map(
                (servico, index) => {
                  const valorMao = Number(servico.valor_mao_de_obra || 0);
                  return `
                  <tr>
                    <td>${servico.id || `S${index + 1}`}</td>
                    <td>${servico.descricao || 'Serviço sem descrição'}</td>
                    <td class="text-right">R$ ${valorMao.toFixed(2).replace(".", ",")}</td>
                  </tr>
                `;
                }
              )
              .join("")}
          </tbody>
        </table>
        ` : '<div class="empty-message">Nenhum serviço adicionado</div>'}
      </div>
    </div>

    <div class="totals">
      <div class="totals-box">
        <div class="total-row"><span>TOTAL PRODUTOS:</span><span>R$ ${totalProdutos.toFixed(2).replace(".", ",")}</span></div>
        <div class="total-row"><span>TOTAL SERVIÇOS:</span><span>R$ ${totalServicos.toFixed(2).replace(".", ",")}</span></div>
        <div class="total-row final"><span>TOTAL GERAL:</span><span>R$ ${totalGeral.toFixed(2).replace(".", ",")}</span></div>
      </div>
    </div>

    <div class="signature-section">
      <p style="margin-top: 30px; font-size: 11px;"><strong>Autorizo a execução dos serviços acima mencionados</strong></p>
      <div class="signature-line"></div>
      <div style="font-size: 11px; margin-top: 5px;">
        <strong>${nomeCliente.toUpperCase()}</strong><br>
        Assinatura do cliente ou pessoa por ele autorizada
      </div>
      <div style="margin-top: 30px; font-size: 10px;">
        Data: ${new Date().toLocaleDateString('pt-BR')}<br>
        Gerado por: SISTEMA TOPCAR
      </div>
    </div>
  </body>
  </html>
`;

      // Verificar se expo-print está disponível
      if (!Print.printToFileAsync) {
        throw new Error("expo-print não está disponível");
      }

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      if (!uri) {
        throw new Error("Falha ao gerar o arquivo PDF");
      }

      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Compartilhar Ordem de Serviço",
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert(
          "PDF Gerado",
          "PDF foi gerado com sucesso, mas o compartilhamento não está disponível neste dispositivo.",
          [
            {
              text: "OK",
              onPress: () => {},
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        "Erro ao gerar PDF",
        `Detalhes do erro: ${error.message}`,
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ]
      );
    }
  };

  // Verificar se há dados mínimos antes de mostrar o botão
  const temDadosMinimos = dadosOrdemServico &&
    (
      dadosOrdemServico.cliente?.nome ||
      (dadosOrdemServico.produtos && dadosOrdemServico.produtos.length > 0) ||
      (dadosOrdemServico.servicos && dadosOrdemServico.servicos.length > 0)
    );

  if (!temDadosMinimos) {
    return (
      <TouchableOpacity
        style={[styles.actionButton, styles.disabledButton]}
        disabled={true}
      >
        <Ionicons
          name="document-text"
          size={20}
          color="#999"
          style={{ marginRight: 5 }}
        />
        <Text style={[styles.actionButtonText, { color: '#999' }]}>
          Adicione dados para gerar PDF
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.actionButton, styles.noteButton]}
      onPress={gerarPDF}
    >
      <Ionicons
        name="document-text"
        size={20}
        color="white"
        style={{ marginRight: 5 }}
      />
      <Text style={styles.actionButtonText}>Gerar PDF</Text>
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
    marginBottom: 10,
  },
  noteButton: {
    backgroundColor: Colors.azul,
    marginRight: 0,
  },
  disabledButton: {
    backgroundColor: '#ccc',
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
