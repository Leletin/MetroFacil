import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image } from "react-native";
import { useRouter } from "expo-router";

const ADMIN_PASSWORD = "admin123";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      router.push("/admin/dashboard");
    } else {
      Alert.alert("Erro", "Senha incorreta. Tente novamente!");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/metro-logo.png")} style={styles.logo} />
      <Text style={styles.title}>Área Administrativa</Text>
      <Text style={styles.subtitle}>Insira a senha para acessar o painel:</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite a senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
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
    color: "#ffffff",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    width: "80%",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#ffcc00",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#004ba0",
  },
});
