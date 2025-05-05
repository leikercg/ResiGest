import React from "react";
import { View, Text, Pressable } from "react-native";
import PersonasLista from "../../components/PersonasLista";
import estilos from "../../../estilos/estilos";
const AdminScreen = ({ navigation }) => {
  return (
    <View style={estilos.estilosListaPersonasVentana.contenedor}>
      <View style={estilos.estilosListaPersonasVentana.titulo}>
        <Text style={estilos.estilosListaPersonasVentana.tituloTexto}>
          Lista de residentes
        </Text>
      </View>
      {/* Componente personalizado, en base al tipo */}
      <PersonasLista navigation={navigation} tipo={"residente"} />
      <Pressable
        style={({ pressed }) => [
          estilos.botonFLotante.botonFLotante,
          { opacity: pressed ? 0.6 : 1 },
        ]}
        onPress={() => navigation.navigate("FormResidente")}
      >
        <Text style={estilos.botonFLotante.buttonText}>+</Text>
      </Pressable>
    </View>
  );
};

export default AdminScreen;
