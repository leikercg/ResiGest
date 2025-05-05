import React from "react";
import { Pressable, View, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import estilos from "../../estilos/estilos";
import FamiliarControlador from "../../controladores/familiarControlador";

const FamiliarItem = ({ item, residentesRelacionados }) => {
  const manejarEliminacion = () => {
    FamiliarControlador.eliminarFamiliar(item.id, Alert.alert);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        estilos.personaItem.item,
        pressed && estilos.personaItem.pressedItem,
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
            {item.apellido}, {item.nombre}
          </Text>
          <View>
            <Text style={estilos.personaItem.edad}>
              Teléfono: {item.telefono}
            </Text>
            {residentesRelacionados?.map((residente) => (
              <View key={residente.id}>
                <Text style={estilos.personaItem.edad}>
                  Residente: {residente.nombre} {residente.apellido}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable onPress={manejarEliminacion} style={{ padding: 5 }}>
          <Ionicons name="close" size={20} color="#EB5757" />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default FamiliarItem;
