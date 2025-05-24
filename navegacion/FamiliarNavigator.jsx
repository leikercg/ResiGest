import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FamiliareScreen from "../vistas/screens/FamiliaresScreens/FamiliarScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CambiarIdioma from "../vistas/screens/ComunesScreens/CambiarIdioma";
import OpcionesScreen from "../vistas/screens/ComunesScreens/OpcionesScreen";
import ResidentScreen from "../vistas/screens/ComunesScreens/ResidenteScreen";
import SeguimientoScreen from "../vistas/screens/ComunesScreens/SeguimientoScreen";
import CambiarContrasena from "../vistas/screens/ComunesScreens/CambiarContrasena";
import EditarContactoScreen from "../vistas/screens/ComunesScreens/EditarContactoScreen";
import ItinerarioResidenteScreen from "../vistas/screens/ComunesScreens/ItinerarioResidenteScreen";
import { Ionicons } from "@expo/vector-icons";
import NavigatorStyles from "../estilos/navigatorStyles";
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
        name="InicioMedico" // Nombre de la pantalla, es el que se usa para navegar
        component={FamiliareScreen}
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

const FamiliarNavigator = () => {
  const { t } = useTranslation();
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

export default FamiliarNavigator;
