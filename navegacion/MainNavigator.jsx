import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../contexto/AuthContext";
import LoginScreen from "../vistas/screens/LoginScreen";
import AdminNavigator from "./AdminNavigator";
import MedicoNavigator from "./MedicoNavigator";
import EnfermeroNavigator from "./EnfermeroNavigator";
import FamiliarNavigator from "./FamiliarNavigator";
import FisioterapiaNavigator from "./FisioterapiaNavigator";
import TerapiaNavigator from "./TerapiaNavigator";
import AsistencialNavigator from "./AsistencialNavigator";

import { ActivityIndicator, View } from "react-native";

// Creamos una pila de navegación
const Stack = createStackNavigator();

const MainNavigator = () => {
  const { user, departamentoId, cargando } = useContext(AuthContext); // Obtenemos datos del contexto

  console.log(departamentoId); // Debuggggggggggggggggggggggg
  if (cargando) {
    // Mostrar carga mientras se carga la información, para evitar pantallas en blanco
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* Espiral de carga */}
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Ocultar header
      }}
    >
      {/* Según el usuario mostramos una u otra pantalla */}
      {!user ? (
        // Si no hay usuario, mostrar pantalla de login
        // Despues del login, el departamentoId se setea en el contexto, lo detecta el navigator y redirige a la pantalla correspondiente
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : departamentoId === 1 ? ( // Si el departamento es 1 mostrar pantalla de administrador
        <Stack.Screen name="AdminNav" component={AdminNavigator} />
      ) : departamentoId === 2 ? ( // Si el departamento es 2 mostrar pantalla de médico
        <Stack.Screen name="MedicoNav" component={MedicoNavigator} />
      ) : departamentoId === 3 ? ( // Si el departamento es 3 mostrar pantalla de enfermero
        <Stack.Screen name="EnfermeroNav" component={EnfermeroNavigator} />
      ) : departamentoId === 4 ? ( // Si el departamento es 4 mostrar pantalla de familiar
        <Stack.Screen name="FamiliarNav" component={FamiliarNavigator} />
      ) : departamentoId === 5 ? ( // Si el departamento es 5 mostrar pantalla de fisioterapia
        <Stack.Screen name="FisioNab" component={FisioterapiaNavigator} />
      ) : departamentoId === 6 ? ( // Si el departamento es 6 mostrar pantalla de terapia
        <Stack.Screen name="TerapiaNav" component={TerapiaNavigator} />
      ) : departamentoId === 7 ? ( // Si el departamento es 7 mostrar pantalla de asistencia
        <Stack.Screen name="AsistenciaNav" component={AsistencialNavigator} />
      ) : null}
    </Stack.Navigator>
  );
};

export default MainNavigator;
