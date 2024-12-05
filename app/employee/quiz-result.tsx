import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  route?: {
    params?: {
      employeeName: string;
      correctAnswers: number;
      totalQuestions: number;
    };
  };
};

const saveResult = async (
  employeeName: string,
  correctAnswers: number,
  totalQuestions: number
) => {
  const currentDate = new Date();
  const result = {
    employeeName,
    correctAnswers,
    totalQuestions,
    date: currentDate.toLocaleDateString(),
    time: currentDate.toLocaleTimeString(),
  };

  try {
    const storedResults = await AsyncStorage.getItem("employeeResults");
    const results = storedResults ? JSON.parse(storedResults) : [];

    const updatedResults = [...results, result];

    await AsyncStorage.setItem("employeeResults", JSON.stringify(updatedResults));
  } catch (error) {
    console.error("Erro ao salvar resultado:", error);
  }
};

export default function QuizResult({ route }: Props) {
  if (!route?.params) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Nenhum resultado encontrado. Por favor, tente novamente.
        </Text>
      </View>
    );
  }

  const { employeeName, correctAnswers, totalQuestions } = route.params;

  useEffect(() => {
    saveResult(employeeName, correctAnswers, totalQuestions);
  }, [employeeName, correctAnswers, totalQuestions]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultado do Quiz</Text>
      <Text style={styles.resultText}>
        {employeeName}, você acertou {correctAnswers} de {totalQuestions} perguntas!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#004ba0",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffcc00",
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
