import { Stack } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";

export default function RootLayout() {
  const router = useRouter();

  const renderBackButton = () => (
    <TouchableOpacity onPress={() => router.replace("/")}>
      <Text style={{ color: "#004ba0", fontSize: 16, fontWeight: "bold" }}>
        Voltar
      </Text>
    </TouchableOpacity>
  );

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Tela Inicial" }} />

      <Stack.Screen
        name="employee/login"
        options={{ title: "Login Funcionário" }}
      />
      <Stack.Screen
        name="employee/home"
        options={{
          title: "Área do Funcionário",
          headerLeft: renderBackButton,
        }}
      />
      <Stack.Screen
        name="employee/quiz"
        options={{
          title: "Quiz",
          headerLeft: renderBackButton,
        }}
      />
      <Stack.Screen
        name="employee/quiz-result"
        options={{
          title: "Resultado do Quiz",
          headerLeft: renderBackButton,
        }}
      />
      <Stack.Screen
        name="employee/history"
        options={{
          title: "Histórico do Funcionário",
          headerLeft: renderBackButton,
        }}
      />

      <Stack.Screen
        name="admin/index"
        options={{ title: "Login Admin" }}
      />
      <Stack.Screen
        name="admin/dashboard"
        options={{
          title: "Painel do Admin",
          headerLeft: renderBackButton,
        }}
      />
    </Stack>
  );
}
