import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require("../assets/metro-logo.png")} style={styles.logo} />

      <Text style={styles.title}>MetroFácil</Text>
      <Text style={styles.subtitle}>Escolha sua área</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/employee/login")}
      >
        <Text style={styles.buttonText}>Área do Funcionário</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => router.push("/admin")}
      >
        <Text style={styles.buttonText}>Área do Administrador</Text>
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
    fontSize: 34,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#ffffff",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ffcc00",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#004ba0",
  },
});
