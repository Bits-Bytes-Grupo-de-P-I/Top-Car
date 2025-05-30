import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";

export default function CardOficina() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();

  // Configura um intervalo para atualizar o tempo a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Verifica se a oficina está aberta quando o componente é montado
    checkIfOpen();

    return () => clearInterval(timer);
  }, []);

  // Atualiza o status de aberto/fechado quando o horário atual muda
  useEffect(() => {
    checkIfOpen();
  }, [currentTime]);

  // Verifica se a oficina está aberta no momento atual
  const checkIfOpen = () => {
    const now = currentTime;
    const day = now.getDay(); // 0 = Domingo, 1 = Segunda, etc.
    const hour = now.getHours();

    // Fechado aos domingos (day === 0)
    if (day === 0) {
      setIsOpen(false);
      return;
    }

    // Aos sábados, aberto apenas até as 13h
    if (day === 6) {
      setIsOpen(hour >= 8 && hour < 13);
      return;
    }

    // Segunda a sexta, aberto das 8h às 18h
    setIsOpen(hour >= 8 && hour < 18);
  };

  // Calcula o tempo restante até fechar ou abrir
  const getTimeRemaining = () => {
    const now = currentTime;
    const day = now.getDay();
    const hour = now.getHours();
    const minutes = now.getMinutes();

    if (isOpen) {
      // Se estiver aberto, calcula quanto tempo falta para fechar
      let closingHour = day === 6 ? 13 : 18; // Sábado fecha às 13h
      let remainingHours = closingHour - hour - 1;
      let remainingMinutes = 60 - minutes;

      if (remainingMinutes === 60) {
        remainingHours += 1;
        remainingMinutes = 0;
      }

      return `Fecha em ${remainingHours}h${
        remainingMinutes > 0 ? ` e ${remainingMinutes}min` : ""
      }`;
    } else {
      // Se estiver fechado, calcula quanto tempo falta para abrir
      if (day === 0) {
        return "Abre amanhã às 8h";
      }

      if (hour < 8) {
        let remainingHours = 8 - hour - 1;
        let remainingMinutes = 60 - minutes;

        if (remainingMinutes === 60) {
          remainingHours += 1;
          remainingMinutes = 0;
        }

        return `Abre em ${remainingHours}h${
          remainingMinutes > 0 ? ` e ${remainingMinutes}min` : ""
        }`;
      } else {
        return "Abre amanhã às 8h";
      }
    }
  };

  // Formata o dia atual para exibição
  const formatDay = () => {
    const days = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];
    return days[currentTime.getDay()];
  };

  // Navegar para a tela de agendamento
  const navigateToAgendamento = () => {
    router.push("/agendamento");
  };

  // Navegar para a tela de mapa
  const navigateToMapa = () => {
    router.push("/mapa");
  };

  return (
    <View style={styles.card}>
      {/* Cabeçalho do Card */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Top Car</Text>
        <View
          style={[
            styles.statusBadge,
            isOpen ? styles.openBadge : styles.closedBadge,
          ]}
        >
          <Text style={styles.statusText}>{isOpen ? "Aberto" : "Fechado"}</Text>
        </View>
      </View>

      {/* Conteúdo do Card */}
      <View style={styles.content}>
        {/* Status e Tempo */}
        <View style={styles.statusContainer}>
          <View style={styles.statusInfo}>
            <Text style={styles.dayText}>{formatDay()}</Text>
            <Text style={styles.timeRemainingText}>{getTimeRemaining()}</Text>
          </View>

          <TouchableOpacity
            style={styles.scheduleButton}
            onPress={navigateToAgendamento}
          >
            <Text style={styles.scheduleButtonText}>Agendar</Text>
          </TouchableOpacity>
        </View>

        {/* Horários de Funcionamento */}
        <View style={styles.hoursContainer}>
          <Text style={styles.sectionTitle}>Horário de Funcionamento:</Text>
          <View style={styles.hourRow}>
            <Text style={styles.dayLabel}>Segunda a Sexta</Text>
            <Text style={styles.hourValue}>08:00 - 18:00</Text>
          </View>
          <View style={styles.hourRow}>
            <Text style={styles.dayLabel}>Sábado</Text>
            <Text style={styles.hourValue}>08:00 - 13:00</Text>
          </View>
          <View style={styles.hourRow}>
            <Text style={styles.dayLabel}>Domingo</Text>
            <Text style={styles.hourValue}>Fechado</Text>
          </View>
        </View>

        {/* Serviços Populares */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Serviços Populares:</Text>
          <View style={styles.servicesContainer}>
            <View style={styles.serviceTag}>
              <Text style={styles.serviceTagText}>Troca de Óleo</Text>
            </View>
            <View style={styles.serviceTag}>
              <Text style={styles.serviceTagText}>Alinhamento</Text>
            </View>
            <View style={styles.serviceTag}>
              <Text style={styles.serviceTagText}>Freios</Text>
            </View>
            <View style={styles.serviceTag}>
              <Text style={styles.serviceTagText}>Diagnóstico</Text>
            </View>
          </View>
        </View>

        {/* Rodapé do Card */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.addressTitle}>Endereço:</Text>
            <Text style={styles.addressText}>Rua das Oficinas, 123</Text>
          </View>
          <TouchableOpacity style={styles.mapButton} onPress={navigateToMapa}>
            <Text style={styles.mapButtonText}>Ver no mapa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
    marginBottom: 16,
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#2563EB", // blue-600
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 20,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  openBadge: {
    backgroundColor: "#10B981", // green-500
  },
  closedBadge: {
    backgroundColor: "#EF4444", // red-500
  },
  statusText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  statusContainer: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  statusInfo: {
    flex: 1,
  },
  dayText: {
    color: "#6B7280", // gray-600
    fontSize: 14,
  },
  timeRemainingText: {
    color: "#1F2937", // gray-800
    fontWeight: "bold",
    fontSize: 18,
  },
  scheduleButton: {
    backgroundColor: "#3B82F6", // blue-500
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  scheduleButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  hoursContainer: {
    backgroundColor: "#F3F4F6", // gray-100
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#1F2937", // gray-800
    fontWeight: "bold",
    marginBottom: 8,
  },
  hourRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  dayLabel: {
    color: "#6B7280", // gray-600
  },
  hourValue: {
    color: "#1F2937", // gray-800
    fontWeight: "500",
  },
  servicesSection: {
    marginBottom: 12,
  },
  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  serviceTag: {
    backgroundColor: "#DBEAFE", // blue-100
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceTagText: {
    color: "#1E40AF", // blue-800
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB", // gray-200
  },
  addressTitle: {
    color: "#1F2937", // gray-800
    fontWeight: "500",
  },
  addressText: {
    color: "#6B7280", // gray-600
  },
  mapButton: {
    backgroundColor: "#EFF6FF", // blue-50
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  mapButtonText: {
    color: "#1D4ED8", // blue-700
  },
});
