import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EmployeeLogin() {
  const router = useRouter();
  const [employeeName, setEmployeeName] = useState("");

  const handleLogin = async () => {
    if (employeeName.trim() === "") {
      Alert.alert("Erro", "Por favor, insira seu nome.");
      return;
    }

    try {
      await AsyncStorage.setItem("currentEmployeeName", employeeName);

      router.push("/employee/home");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível realizar o login. Tente novamente.");
      console.error("Erro ao salvar o nome do funcionário:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/metro-logo.png")} style={styles.logo} />

      <Text style={styles.title}>Área do Funcionário</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={employeeName}
        onChangeText={setEmployeeName}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004ba0",
    alignItems: "center",
    justifyContent: "center",
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
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    width: "80%",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#ffcc00",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#004ba0",
  },
});
