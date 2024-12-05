import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EmployeeIndex() {
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const employeeId = await AsyncStorage.getItem("currentEmployeeId");
      if (employeeId) {
        router.replace("/employee/home");
      } else {
        router.replace("/employee/login");
      }
    };

    checkLogin();
  }, []);

  return null;
}
