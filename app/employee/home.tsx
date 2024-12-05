import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

type HistoryItem = {
  date: string;
  score: number;
  total: number;
};

export default function EmployeeHome() {
  const router = useRouter();
  const [employeeName, setEmployeeName] = useState<string>("Funcionário");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        const name = await AsyncStorage.getItem("currentEmployeeName");
        if (name) {
          setEmployeeName(name);

          const storedHistory = await AsyncStorage.getItem(`history_${name}`);
          if (storedHistory) {
            const parsedHistory = JSON.parse(storedHistory);

            const validatedHistory = parsedHistory.map((item: any) => ({
              date: item.date || "Data desconhecida",
              score: item.correctAnswers || 0,
              total: item.totalQuestions || 0,
            }));

            setHistory(validatedHistory);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar histórico do funcionário:", error);
      }
    };

    loadEmployeeData();
  }, []);

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyText}>
        {item.date}: {item.score}/{item.total} perguntas certas
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/metro-logo.png")} style={styles.logo} />

      <Text style={styles.title}>Bem-vindo, {employeeName}!</Text>
      <Text style={styles.subtitle}>Aqui está o seu histórico:</Text>

      {history.length > 0 ? (
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderHistoryItem}
          style={{ width: "100%" }}
        />
      ) : (
        <Text style={styles.noHistoryText}>Nenhum histórico encontrado.</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push({ pathname: "/employee/quiz", params: { employeeName } })
        }
      >
        <Text style={styles.buttonText}>Iniciar o Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004ba0",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
    padding: 20,
  },
  logo: {
    width: 220,
    height: 180,
    marginBottom: 10,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  noHistoryText: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    marginVertical: 20,
  },
  historyItem: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  historyText: {
    fontSize: 16,
    color: "#004ba0",
  },
  button: {
    backgroundColor: "#ffcc00",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#004ba0",
  },
});
