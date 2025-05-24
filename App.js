import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./navegacion/MainNavigator"; // Archivo con la navegación
import { AuthProvider } from "./contexto/AuthContext"; // Importamos el AuthContext
import "./i18n";

export default function App() {
  return (
    <AuthProvider>
      {/* Con esto damos el contexto a toda los hijos de este elemento, toda la app)*/}
      <StatusBar />
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
