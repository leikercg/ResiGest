import React, { useContext } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import estilos from "../../estilos/estilos"; // Estilos
import ResidenteControlador from "../../controladores/residenteControlador"; // Importar el controlador
import { AuthContext } from "../../contexto/AuthContext"; // Importar el contexto de autenticación

// Recibe una instancia del modelo Residente y la navegación como argumentos
const ResidenteItem = ({ residente, navigation }) => {
  // Obtener el departamentoId del usuario autenticado
  const { departamentoId } = useContext(AuthContext);

  const EliminarResidente = async () => {
    try {
      await ResidenteControlador.eliminarResidente(
        residente.id,
        Alert.alert, // Pasamos la función Alert.alert como argumento
      );
    } catch (error) {
      console.error("Error al eliminar el residente:", error);
    }
  };

  // Solo permitir eliminar si el usuario es del departamento 1
  const puedeEliminar = departamentoId === 1;

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("ResidenteScreen", {
          residente: residente, // Enviamos el residente
        })
      } // Navega a ResidenteScreen con el id del residente y su edad
      style={({ pressed }) => [
        estilos.personaItem.item,
        pressed && estilos.personaItem.pressedItem, // Cambia el estilo cuando está presionado
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <View>
          <Text style={estilos.personaItem.nombre}>
            {residente.apellido}, {residente.nombre}
          </Text>
          <Text style={estilos.personaItem.edad}>
            Edad: {residente.calcularEdad()}
          </Text>
        </View>
        {puedeEliminar && (
          <Pressable onPress={EliminarResidente} style={{ padding: 5 }}>
            <Ionicons name="close" size={20} color="#EB5757" />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

export default ResidenteItem;
