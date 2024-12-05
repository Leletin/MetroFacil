import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function AdminDashboard() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [answers, setAnswers] = useState<string[]>(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(
    null
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [employeeResults, setEmployeeResults] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedQuestions = await AsyncStorage.getItem("quizQuestions");
        if (storedQuestions) {
          setQuestions(JSON.parse(storedQuestions));
        }

        const storedResults = await AsyncStorage.getItem("employeeResults");
        if (storedResults) {
          setEmployeeResults(JSON.parse(storedResults));
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const handleBackPress = () => {
      router.replace("/");
    };

    return () => {
      handleBackPress();
    };
  }, [router]);

  const saveQuestions = async (updatedQuestions: any[]) => {
    await AsyncStorage.setItem("quizQuestions", JSON.stringify(updatedQuestions));
    setQuestions(updatedQuestions);
  };

  const addOrUpdateQuestion = () => {
    if (!newQuestion.trim()) {
      Alert.alert("Erro", "A pergunta não pode estar vazia.");
      return;
    }

    if (answers.some((answer) => !answer.trim())) {
      Alert.alert("Erro", "Todas as respostas devem ser preenchidas.");
      return;
    }

    if (correctAnswerIndex === null) {
      Alert.alert("Erro", "Selecione a resposta correta.");
      return;
    }

    if (editingIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = {
        question: newQuestion,
        answers: answers.map((answer, index) => ({
          text: answer,
          correct: index === correctAnswerIndex,
        })),
      };
      saveQuestions(updatedQuestions);
      setEditingIndex(null);
    } else {
      const updatedQuestions = [
        ...questions,
        {
          question: newQuestion,
          answers: answers.map((answer, index) => ({
            text: answer,
            correct: index === correctAnswerIndex,
          })),
        },
      ];
      saveQuestions(updatedQuestions);
    }

    setNewQuestion("");
    setAnswers(["", "", "", ""]);
    setCorrectAnswerIndex(null);
  };

  const deleteQuestion = (index: number) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja excluir esta pergunta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: () => {
            const updatedQuestions = questions.filter((_, i) => i !== index);
            saveQuestions(updatedQuestions);
          },
          style: "destructive",
        },
      ]
    );
  };

  const editQuestion = (index: number) => {
    const questionToEdit = questions[index];
    setNewQuestion(questionToEdit.question);
    setAnswers(questionToEdit.answers.map((answer: any) => answer.text));
    setCorrectAnswerIndex(
      questionToEdit.answers.findIndex((answer: any) => answer.correct)
    );
    setEditingIndex(index);
  };

  const clearResults = async () => {
    Alert.alert(
      "Confirmar Limpeza",
      "Você tem certeza que deseja limpar todos os resultados?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("employeeResults");
              setEmployeeResults([]);
            } catch (error) {
              console.error("Erro ao limpar resultados:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Painel do Administrador</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Digite a pergunta:</Text>
          <TextInput
            style={styles.questionInput}
            placeholder="Exemplo: Qual é a cor do céu?"
            value={newQuestion}
            onChangeText={setNewQuestion}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Respostas:</Text>
          {answers.map((answer, index) => (
            <View key={index} style={styles.answerRow}>
              <TextInput
                style={styles.answerInput}
                placeholder={`Resposta ${index + 1}`}
                value={answer}
                onChangeText={(text) => {
                  const updatedAnswers = [...answers];
                  updatedAnswers[index] = text;
                  setAnswers(updatedAnswers);
                }}
              />
              <TouchableOpacity
                style={[
                  styles.correctButton,
                  correctAnswerIndex === index && styles.correctButtonSelected,
                ]}
                onPress={() => setCorrectAnswerIndex(index)}
              >
                <Text style={styles.correctButtonText}>
                  {correctAnswerIndex === index ? "Correta" : "Selecionar"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={addOrUpdateQuestion}
        >
          <Text style={styles.addButtonText}>
            {editingIndex !== null ? "Atualizar Pergunta" : "Adicionar Pergunta"}
          </Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.label}>Perguntas adicionadas:</Text>
          {questions.map((item, index) => (
            <View key={index} style={styles.questionItem}>
              <Text style={styles.questionText}>{item.question}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => editQuestion(index)}
                >
                  <Text style={styles.actionButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteQuestion(index)}
                >
                  <Text style={styles.actionButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Resultados dos Funcionários:</Text>
          {employeeResults.length === 0 ? (
            <Text style={styles.noResultsText}>
              Nenhum resultado disponível.
            </Text>
          ) : (
            employeeResults.map((result, index) => (
              <View key={index} style={styles.resultItem}>
                <Text style={styles.resultText}>
                  <Text style={styles.boldText}>Funcionário:</Text>{" "}
                  {result.employeeName}
                </Text>
                <Text style={styles.resultText}>
                  <Text style={styles.boldText}>Resultado:</Text>{" "}
                  {result.correctAnswers}/{result.totalQuestions}
                </Text>
                <Text style={styles.resultText}>
                  <Text style={styles.boldText}>Data:</Text> {result.date}
                </Text>
                <Text style={styles.resultText}>
                  <Text style={styles.boldText}>Hora:</Text> {result.time}
                </Text>
              </View>
            ))
          )}

          <TouchableOpacity style={styles.clearButton} onPress={clearResults}>
            <Text style={styles.clearButtonText}>Limpar Resultados</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004ba0",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#ffcc00",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 10,
  },
  questionInput: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    width: "100%",
    marginBottom: 10,
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  answerInput: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  correctButton: {
    backgroundColor: "#cccccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  correctButtonSelected: {
    backgroundColor: "green",
  },
  correctButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#ffcc00",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#004ba0",
  },
  questionItem: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  questionText: {
    fontSize: 16,
    color: "#004ba0",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  noResultsText: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    marginVertical: 20,
  },
  resultItem: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    color: "#004ba0",
    marginBottom: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  clearButton: {
    backgroundColor: "#f44336",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  clearButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
