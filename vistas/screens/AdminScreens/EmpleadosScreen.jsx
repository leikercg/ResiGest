import React from "react";
import { View, Text, Pressable } from "react-native";
import estilos from "../../../estilos/estilos";
import PersonasLista from "../../components/PersonasLista";

const EmpleadosScreen = ({ navigation }) => {
  return (
    <View style={estilos.estilosListaPersonasVentana.contenedor}>
      <View style={estilos.estilosListaPersonasVentana.titulo}>
        <Text style={estilos.estilosListaPersonasVentana.tituloTexto}>
          Lista de empleados
        </Text>
      </View>
      <PersonasLista navigation={navigation} tipo="empleado" />
      <Pressable
        style={({ pressed }) => [
          estilos.botonFLotante.botonFLotante,
          { opacity: pressed ? 0.6 : 1 },
        ]}
        onPress={() =>
          navigation.navigate("RegistroScreen", { tipo: "empleado" })
        }
      >
        <Text style={estilos.botonFLotante.buttonText}>+</Text>
      </Pressable>
    </View>
  );
};

export default EmpleadosScreen;
