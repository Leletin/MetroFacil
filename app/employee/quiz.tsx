import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Quiz() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null
  );
  const [quizFinished, setQuizFinished] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const storedQuestions = await AsyncStorage.getItem("quizQuestions");
        if (storedQuestions) {
          setQuestions(JSON.parse(storedQuestions));
        }

        const name = await AsyncStorage.getItem("currentEmployeeName");
        if (name) {
          setEmployeeName(name);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadQuizData();
  }, []);

  const handleAnswer = (isCorrect: boolean, index: number) => {
    setSelectedAnswerIndex(index);
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswerIndex(null);
      } else {
        setQuizFinished(true);
        saveResult(correctAnswers + (isCorrect ? 1 : 0));
      }
    }, 1000);
  };

  const saveResult = async (finalCorrectAnswers: number) => {
    const currentDate = new Date();
    const result = {
      employeeName,
      correctAnswers: finalCorrectAnswers,
      totalQuestions: questions.length,
      date: currentDate.toLocaleDateString(),
      time: currentDate.toLocaleTimeString(),
    };

    try {
      const storedHistory = await AsyncStorage.getItem(`history_${employeeName}`);
      const history = storedHistory ? JSON.parse(storedHistory) : [];
      const updatedHistory = [...history, result];
      await AsyncStorage.setItem(`history_${employeeName}`, JSON.stringify(updatedHistory));

      const storedAdminResults = await AsyncStorage.getItem("employeeResults");
      const adminResults = storedAdminResults ? JSON.parse(storedAdminResults) : [];
      const updatedAdminResults = [...adminResults, result];
      await AsyncStorage.setItem("employeeResults", JSON.stringify(updatedAdminResults));
    } catch (error) {
      console.error("Erro ao salvar resultado:", error);
    }
  };

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Image
          source={require("../../assets/metro-logo.png")}
          style={styles.logo}
        />
        <Text style={styles.errorText}>Nenhuma pergunta disponível.</Text>
      </View>
    );
  }

  if (quizFinished) {
    return (
      <View style={styles.container}>
        <Image
          source={require("../../assets/metro-logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Quiz Finalizado!</Text>
        <Text style={styles.resultText}>
          {employeeName}, você acertou {correctAnswers} de {questions.length} perguntas.
        </Text>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => router.replace("/employee/home")}
        >
          <Text style={styles.historyButtonText}>Ver Histórico</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/metro-logo.png")}
        style={styles.logo}
      />
      <Text style={styles.question}>{currentQuestion.question}</Text>
      {currentQuestion.answers.map((answer: any, index: number) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.answerButton,
            selectedAnswerIndex === index &&
              (answer.correct ? styles.correctAnswer : styles.incorrectAnswer),
          ]}
          onPress={() => handleAnswer(answer.correct, index)}
          disabled={selectedAnswerIndex !== null}
        >
          <Text style={styles.answerText}>{answer.text}</Text>
        </TouchableOpacity>
      ))}
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
  logo: {
    width: 200,
    height: 150,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffcc00",
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  answerButton: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  correctAnswer: {
    backgroundColor: "green",
  },
  incorrectAnswer: {
    backgroundColor: "red",
  },
  answerText: {
    fontSize: 16,
    color: "#004ba0",
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
  historyButton: {
    backgroundColor: "#ffcc00",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 20,
  },
  historyButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#004ba0",
  },
});
