import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FisioterapiaScreen from "../vistas/screens/FisioterapiaScreens/FisioterapiaScreen";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CambiarIdioma from "../vistas/screens/ComunesScreens/CambiarIdioma"; // Otra pantalla de administrador
import AgendaScreen from "../vistas/screens/ComunesScreens/AgendaScreen"; // Pantalla dr agenda
import OpcionesScreen from "../vistas/screens/ComunesScreens/OpcionesScreen"; // Pantalla de opciones
import ResidentScreen from "../vistas/screens/ComunesScreens/ResidenteScreen"; // Pantalla de detalle del residente
import SeguimientoScreen from "../vistas/screens/ComunesScreens/SeguimientoScreen";
import CambiarContrasena from "../vistas/screens/ComunesScreens/CambiarContrasena";
import EditarContactoScreen from "../vistas/screens/ComunesScreens/EditarContactoScreen"; // Pantalla de editar contacto
import ItinerarioResidenteScreen from "../vistas/screens/ComunesScreens/ItinerarioResidenteScreen"; // Pantalla de itinerario

import { Ionicons } from "@expo/vector-icons";
import SesionesScreen from "../vistas/screens/FisioterapiaScreens/SesionesScreen";

//import HistorialPaciente from "../screens/HistorialPaciente";

const Tab = createBottomTabNavigator(); // Para ver la navegacion por pestañas
const Stack = createStackNavigator(); // Para ver la navegación por pila, creamos varias

const OpcionesStack = () => {
  // Navegación para las opciones
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Opciones"
        component={OpcionesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditarContacto"
        component={EditarContactoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CambiarIdioma"
        component={CambiarIdioma}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CambiarContrasena"
        component={CambiarContrasena}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const InicioStack = () => {
  // Navegación para la pantalla de inicio
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InicioFisioterapia" // Nombre de la pantalla, es el que se usa para navegar
        component={FisioterapiaScreen}
        options={{ headerShown: false, headerStyle: styles.headerStyle }} // Opciones de la pantalla, ocultamos header
      />
      <Stack.Screen
        name="ResidenteScreen"
        component={ResidentScreen}
        options={{ headerShown: false, headerStyle: styles.headerStyle }}
      />
      <Stack.Screen
        name="SeguimientoScreen"
        component={SeguimientoScreen}
        options={{ headerShown: false, headerStyle: styles.headerStyle }}
      />
      <Stack.Screen
        name="SesionesScreen"
        component={SesionesScreen}
        options={{ headerShown: false, headerStyle: styles.headerStyle }}
      />
      <Stack.Screen
        name="ItinerarioResidenteScreen"
        component={ItinerarioResidenteScreen}
        options={{ headerShown: false, headerStyle: styles.headerStyle }}
      />
    </Stack.Navigator>
  );
};
const AgendaStack = () => {
  // Navegación para la pantalla de la agenda de empleados
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AgendaScreen" // Nombre de la pantalla, es el que se usa para navegar
        component={AgendaScreen}
        options={{ headerShown: false, headerStyle: styles.headerStyle }} // Opciones de la pantalla, ocultamos header
      />
    </Stack.Navigator>
  );
};

const FisioterapiaNavigator = () => {
  return (
    <Tab.Navigator
      lazy={false}
      detachInactiveScreens={false}
      screenOptions={{
        tabBarActiveTintColor: "blue", // Color activo
        tabBarInactiveTintColor: "gray", // Color inactivo
      }}
    >
      <Tab.Screen
        name="InicioStack"
        component={InicioStack}
        options={{
          title: null,
          tabBarLabel: "Inicio",
          headerStyle: styles.headerStyle,
          tabBarIcon: ({ color, size }) => (
            // Recibe el color y un tamaño por defecto
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Agenda"
        component={AgendaStack}
        options={{
          title: null,
          tabBarLabel: "Agenda",
          headerStyle: styles.headerStyle,
          tabBarIcon: ({ color, size }) => (
            // Recibe el color y un tamaño por defecto
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Options"
        component={OpcionesStack}
        options={{
          title: null,
          tabBarLabel: "Opciones",
          headerStyle: styles.headerStyle,
          tabBarIcon: ({ color, size }) => (
            // Recibe el color y un tamaño por defecto
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Estilos
const styles = StyleSheet.create({
  headerStyle: {
    height: 50, // Reducir la altura del header
    shadowColor: "transparent", // Eliminar sombra entre la barrad de estado y la aop
  },
  headerText: {
    // Estilos de texto
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default FisioterapiaNavigator;
