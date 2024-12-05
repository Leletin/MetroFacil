import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      const employeeId = await AsyncStorage.getItem("currentEmployeeId");
      if (employeeId) {
        const storedHistory = await AsyncStorage.getItem(`history_${employeeId}`);
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      }
    };

    loadHistory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seu Histórico de Resultados</Text>

      {history.length === 0 ? (
        <Text style={styles.noHistoryText}>Nenhum resultado encontrado.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text style={styles.resultText}>
                {item.date}: {item.score}/{item.total} perguntas certas
              </Text>
            </View>
          )}
        />
      )}
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
  title: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  noHistoryText: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    marginTop: 20,
  },
  resultItem: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    width: "90%",
  },
  resultText: {
    fontSize: 16,
    color: "#004ba0",
  },
});
