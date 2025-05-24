import React from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdminScreen from "../vistas/screens/AdminScreens/AdminScreen";
import CambiarIdioma from "../vistas/screens/ComunesScreens/CambiarIdioma";
import RegistroScreen from "../vistas/screens/AdminScreens/RegistroScreen";
import EmpleadosScreen from "../vistas/screens/AdminScreens/EmpleadosScreen";
import FamiliaresScreen from "../vistas/screens/AdminScreens/FamiliaresScreen";
import OpcionesScreen from "../vistas/screens/ComunesScreens/OpcionesScreen";
import ResidentScreen from "../vistas/screens/ComunesScreens/ResidenteScreen";
import FormResidente from "../vistas/screens/AdminScreens/FormResidente";
import SeguimientoScreen from "../vistas/screens/ComunesScreens/SeguimientoScreen";
import CambiarContrasena from "../vistas/screens/ComunesScreens/CambiarContrasena";
import ItinerarioResidenteScreen from "../vistas/screens/ComunesScreens/ItinerarioResidenteScreen";
import { Ionicons } from "@expo/vector-icons";
import NavigatorStyles from "../estilos/navigatorStyles.jsx";
import { useTranslation } from "react-i18next";

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
        name="Registro"
        component={RegistroScreen}
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
        name="InicioAdmin" // Nombre de la pantalla, es el que se usa para navegar
        component={AdminScreen}
        options={{
          headerShown: false,
          headerStyle: NavigatorStyles.headerStyle,
        }} // Opciones de la pantalla, ocultamos header
      />
      <Stack.Screen
        name="ResidenteScreen"
        component={ResidentScreen}
        options={{
          headerShown: false,
          headerStyle: NavigatorStyles.headerStyle,
        }}
      />
      <Stack.Screen
        name="FormResidente"
        component={FormResidente}
        options={{
          headerShown: false,
          headerStyle: NavigatorStyles.headerStyle,
        }}
      />
      <Stack.Screen
        name="SeguimientoScreen"
        component={SeguimientoScreen}
        options={{
          headerShown: false,
          headerStyle: NavigatorStyles.headerStyle,
        }}
      />
      <Stack.Screen
        name="ItinerarioResidenteScreen"
        component={ItinerarioResidenteScreen}
        options={{
          headerShown: false,
          headerStyle: NavigatorStyles.headerStyle,
        }}
      />
    </Stack.Navigator>
  );
};
const EmpleadoStack = () => {
  // Navegación para la pantalla de empleados
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EmpleadosScreen" // Nombre de la pantalla, es el que se usa para navegar
        component={EmpleadosScreen}
        options={{
          headerShown: false,
          headerStyle: NavigatorStyles.headerStyle,
        }} // Opciones de la pantalla, ocultamos header
      />
      <Stack.Screen
        name="RegistroScreen"
        component={RegistroScreen}
        options={{
          headerShown: false,
          headerStyle: NavigatorStyles.headerStyle,
        }}
      />
    </Stack.Navigator>
  );
};
const FamiliaStack = () => {
  // Navegación para la pantalla de familiares
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FamiliaresScreen" // Nombre de la pantalla, es el que se usa para navegar
        component={FamiliaresScreen}
        options={{
          headerShown: false,
          headerStyle: NavigatorStyles.headerStyle,
        }} // Opciones de la pantalla, ocultamos header
      />
      <Stack.Screen
        name="RegistroScreen"
        component={RegistroScreen}
        options={{
          headerShown: false,
          headerStyle: NavigatorStyles.headerStyle,
        }}
      />
    </Stack.Navigator>
  );
};

const AdminNavigator = () => {
  const { t, i18n } = useTranslation();

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
          tabBarLabel: t("inicio"),
          headerStyle: NavigatorStyles.headerStyle,
          tabBarIcon: ({ color, size }) => (
            // Recibe el color y un tamaño por defecto
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Empleados"
        component={EmpleadoStack}
        options={{
          title: null,
          tabBarLabel: t("equipo"),
          headerStyle: NavigatorStyles.headerStyle,
          tabBarIcon: ({ color, size }) => (
            // Recibe el color y un tamaño por defecto
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FamiliaStack"
        component={FamiliaStack}
        options={{
          title: null,
          tabBarLabel: t("familia"),
          headerStyle: NavigatorStyles.headerStyle,
          tabBarIcon: ({ color, size }) => (
            // Recibe el color y un tamaño por defecto
            <Ionicons name="people-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Options"
        component={OpcionesStack}
        options={{
          title: null,
          tabBarLabel: t("opciones"),
          headerStyle: NavigatorStyles.headerStyle,
          tabBarIcon: ({ color, size }) => (
            // Recibe el color y un tamaño por defecto
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    height: 50, // Reducir la altura del header
    shadowColor: "transparent", // Eliminar sombra entre la barrad de estado y la aop
  },
});

export default AdminNavigator;
