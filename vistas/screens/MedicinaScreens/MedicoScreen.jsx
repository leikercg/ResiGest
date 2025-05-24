import React from "react";
import estilos from "../../../estilos/estilos";
import PersonasLista from "../../components/PersonasLista";
import { View, Text } from "react-native";

const MedicoScreen = ({ navigation }) => {
  return (
    <View style={estilos.estilosListaPersonasVentana.contenedor}>
      <View style={estilos.estilosListaPersonasVentana.titulo}>
        <Text style={estilos.estilosListaPersonasVentana.tituloTexto}>
          Lista de residentes
        </Text>
      </View>
      <PersonasLista navigation={navigation} tipo={"residente"} />
    </View>
  );
};

export default MedicoScreen;
