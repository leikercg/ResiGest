import React from "react";
import estilos from "../../../estilos/estilos"; // Estilos
import PersonasLista from "../../components/PersonasLista"; // Componente ResidentesLista
import { View, Text } from "react-native";

const FamiliareScreen = ({ navigation }) => {
  return (
    <View style={estilos.estilosListaPersonasVentana.contenedor}>
      <View style={estilos.estilosListaPersonasVentana.titulo}>
        <Text style={estilos.estilosListaPersonasVentana.tituloTexto}>
          Lista de residentes
        </Text>
      </View>
      {/* Componente personalizado, en base al tipo */}
      <PersonasLista navigation={navigation} tipo={"residente"} />
    </View>
  );
};

export default FamiliareScreen;
