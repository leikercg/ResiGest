import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import EnfermeroScreen from "../vistas/screens/EnfermeriaScreens/EnfermeroScreen";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CambiarIdioma from "../vistas/screens/ComunesScreens/CambiarIdioma"; // Otra pantalla de administrador
import AgendaScreen from "../vistas/screens/ComunesScreens/AgendaScreen"; // Pantalla dr agenda
import OpcionesScreen from "../vistas/screens/ComunesScreens/OpcionesScreen"; // Pantalla de opciones
import ResidentScreen from "../vistas/screens/ComunesScreens/ResidenteScreen"; // Pantalla de detalle del residente
import SeguimientoScreen from "../vistas/screens/ComunesScreens/SeguimientoScreen"; // Pantalla de seguimiento
import CambiarContrasena from "../vistas/screens/ComunesScreens/CambiarContrasena"; // Pantalla de cambiar contraseña
import EditarContactoScreen from "../vistas/screens/ComunesScreens/EditarContactoScreen"; // Pantalla de editar contacto
import CurasScreen from "../vistas/screens/EnfermeriaScreens/CurasScreen"; // Pantalla de curas
import TareasScreen from "../vistas/screens/EnfermeriaScreens/TareasScreen"; // Pantalla de tareas
import ItinerarioResidenteScreen from "../vistas/screens/ComunesScreens/ItinerarioResidenteScreen"; // Pantalla de itinerario

import { Ionicons } from "@expo/vector-icons";

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
        name="CambiarIdioma"
        component={CambiarIdioma}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CambiarContrasena"
        component={CambiarContrasena}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="EditarContacto"
        component={EditarContactoScreen}
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
        name="InicioEnfermero" // Nombre de la pantalla, es el que se usa para navegar
        component={EnfermeroScreen}
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
        name="CurasScreen"
        component={CurasScreen}
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

const TareasStack = () => {
  // Navegación para la pantalla de la agenda de empleados
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TareasScreen"
        component={TareasScreen}
        options={{ headerShown: false, headerStyle: styles.headerStyle }}
      />
    </Stack.Navigator>
  );
};

const EnfermeroNavigator = () => {
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
        name="TareasStack"
        component={TareasStack}
        options={{
          title: null,
          tabBarLabel: "Tareas",
          headerStyle: styles.headerStyle,
          tabBarIcon: ({ color, size }) => (
            // Recibe el color y un tamaño por defecto
            <Ionicons name="list" size={size} color={color} />
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

export default EnfermeroNavigator;
