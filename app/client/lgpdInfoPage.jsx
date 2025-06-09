import React from 'react';
import { View, Text, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// COMPONENTES 
import PageHeader from "@/components/PageHeader";

// ÍCONES
import { Ionicons } from '@expo/vector-icons';

// CORES
import Colors from "@/constants/Colors";

export default function lgpdInfoPage() {

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/fundo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <PageHeader
          title="Informações"
          containerStyle={{ backgroundColor: Colors.azulClaro }}
          titleStyle={{ color: "#fff" }}
        />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            
            {/* Seção LGPD */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="shield-checkmark" size={28} color="#3498db" />
                <Text style={styles.sectionTitle}>Lei Geral de Proteção de Dados (LGPD)</Text>
              </View>
              
              <Text style={styles.paragraph}>
                Em conformidade com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais), 
                informamos que nosso aplicativo foi desenvolvido com o máximo cuidado para proteger 
                suas informações pessoais.
              </Text>

              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Dados Coletados:</Text>
                <Text style={styles.bulletPoint}>• Nome completo e informações de contato</Text>
                <Text style={styles.bulletPoint}>• Dados do veículo (modelo, placa, ano)</Text>
                <Text style={styles.bulletPoint}>• Histórico de serviços realizados</Text>
                <Text style={styles.bulletPoint}>• Informações de agendamento</Text>
              </View>

              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Finalidade do Tratamento:</Text>
                <Text style={styles.bulletPoint}>• Prestação de serviços automotivos</Text>
                <Text style={styles.bulletPoint}>• Comunicação sobre status dos serviços</Text>
                <Text style={styles.bulletPoint}>• Agendamento e controle de atendimentos</Text>
                <Text style={styles.bulletPoint}>• Melhoria da experiência do cliente</Text>
              </View>

              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Seus Direitos:</Text>
                <Text style={styles.bulletPoint}>• Confirmação da existência de tratamento</Text>
                <Text style={styles.bulletPoint}>• Acesso aos dados pessoais</Text>
                <Text style={styles.bulletPoint}>• Correção de dados incompletos ou inexatos</Text>
                <Text style={styles.bulletPoint}>• Eliminação de dados desnecessários</Text>
                <Text style={styles.bulletPoint}>• Portabilidade dos dados</Text>
              </View>

              <Text style={styles.paragraph}>
                Seus dados são armazenados de forma segura e não são compartilhados com terceiros 
                sem seu consentimento expresso, exceto quando exigido por lei.
              </Text>
            </View>

            {/* Seção Sobre o Aplicativo */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="phone-portrait" size={28} color="#e74c3c" />
                <Text style={styles.sectionTitle}>Sobre o Aplicativo</Text>
              </View>

              <Text style={styles.paragraph}>
                Nosso aplicativo foi desenvolvido com o objetivo de revolucionar a relação entre 
                oficina e cliente, proporcionando transparência, praticidade e acompanhamento 
                em tempo real dos serviços automotivos.
              </Text>

              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Por que foi criado?</Text>
                <Text style={styles.bulletPoint}>• Melhorar a comunicação oficina-cliente</Text>
                <Text style={styles.bulletPoint}>• Aumentar a transparência nos serviços</Text>
                <Text style={styles.bulletPoint}>• Facilitar o agendamento de atendimentos</Text>
                <Text style={styles.bulletPoint}>• Reduzir tempo de espera e incertezas</Text>
                <Text style={styles.bulletPoint}>• Modernizar a experiência do cliente</Text>
              </View>
            </View>

            {/* Funcionalidades */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="settings" size={28} color="#9b59b6" />
                <Text style={styles.sectionTitle}>Funcionalidades Principais</Text>
              </View>

              <View style={styles.featureCard}>
                <Ionicons name="calendar" size={24} color="#3498db" />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Agendamento Online</Text>
                  <Text style={styles.featureDescription}>
                    Agende seu atendimento de maneira simples e rápida e tenha prioridade.
                  </Text>
                </View>
              </View>

              <View style={styles.featureCard}>
                <Ionicons name="checkmark-circle" size={24} color="#27ae60" />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Histórico de Serviços</Text>
                  <Text style={styles.featureDescription}>
                    Visualize os serviços já realizados em seu veículo, com 
                    detalhes completos e data de execução.
                  </Text>
                </View>
              </View>

              <View style={styles.featureCard}>
                <Ionicons name="time" size={24} color="#f39c12" />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Serviços Pendentes</Text>
                  <Text style={styles.featureDescription}>
                    Acompanhe serviços que ficaram pendentes e precisam ser agendados 
                    ou finalizados posteriormente.
                  </Text>
                </View>
              </View>

              <View style={styles.featureCard}>
                <Ionicons name="sync-circle" size={24} color="#e74c3c" />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Status em Tempo Real</Text>
                  <Text style={styles.featureDescription}>
                    Receba atualizações instantâneas sobre o progresso dos serviços 
                    em andamento, sabendo exatamente em que etapa seu veículo se encontra.
                  </Text>
                </View>
              </View>
            </View>

            {/* Benefícios */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="star" size={28} color="#f1c40f" />
                <Text style={styles.sectionTitle}>Benefícios para Você</Text>
              </View>

              <View style={styles.benefitItem}>
                <Ionicons name="flash" size={20} color="#3498db" />
                <Text style={styles.benefitText}>Economia de tempo no agendamento</Text>
              </View>

              <View style={styles.benefitItem}>
                <Ionicons name="eye" size={20} color="#3498db" />
                <Text style={styles.benefitText}>Transparência total nos serviços</Text>
              </View>

              <View style={styles.benefitItem}>
                <Ionicons name="notifications" size={20} color="#3498db" />
                <Text style={styles.benefitText}>Notificações importantes em tempo real</Text>
              </View>

              <View style={styles.benefitItem}>
                <Ionicons name="document-text" size={20} color="#3498db" />
                <Text style={styles.benefitText}>Histórico organizado e acessível</Text>
              </View>

              <View style={styles.benefitItem}>
                <Ionicons name="phone-portrait" size={20} color="#3498db" />
                <Text style={styles.benefitText}>Comodidade na palma da mão</Text>
              </View>
            </View>

            {/* Contato */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="mail" size={28} color="#16a085" />
                <Text style={styles.sectionTitle}>Contato</Text>
              </View>

              <Text style={styles.paragraph}>
                Para dúvidas sobre o tratamento de seus dados pessoais ou sobre o 
                funcionamento do aplicativo, entre em contato conosco:
              </Text>

              <View style={styles.contactInfo}>
                <View style={styles.contactItem}>
                  <Ionicons name="mail-outline" size={20} color="#7f8c8d" />
                  <Text style={styles.contactText}>topcarpo@hotmail.com</Text>
                </View>
                <View style={styles.contactItem}>
                  <Ionicons name="call-outline" size={20} color="#7f8c8d" />
                  <Text style={styles.contactText}>(34) 3811-2735</Text>
                </View>
                <View style={styles.contactItem}>
                  <Ionicons name="logo-instagram" size={20} color="#7f8c8d" />
                  <Text style={styles.contactText}>topcarp.o</Text>
                </View>
              </View>
            </View>

            <Text style={styles.footer}>
              Última atualização: Junho de 2025
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginLeft: 12,
    flex: 1,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495e',
    marginBottom: 15,
    textAlign: 'justify',
  },
  subsection: {
    marginBottom: 15,
  },
  subsectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 22,
    color: '#34495e',
    marginBottom: 4,
    paddingLeft: 5,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(248, 249, 250, 0.8)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  featureContent: {
    flex: 1,
    marginLeft: 12,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 15,
    lineHeight: 20,
    color: '#7f8c8d',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 16,
    color: '#34495e',
    marginLeft: 10,
    flex: 1,
  },
  contactInfo: {
    backgroundColor: 'rgba(248, 249, 250, 0.8)',
    borderRadius: 8,
    padding: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#34495e',
    marginLeft: 10,
  },
  footer: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});