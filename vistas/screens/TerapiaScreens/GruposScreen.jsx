import React from "react";
import { View, Text, StyleSheet } from "react-native";
import estilos from "../../../estilos/estilos";

const GruposScreen = ({ navigation }) => {
  return (
    <View style={estilos.estilosListaPersonasVentana.contenedor}>
      {/* Encabezado con título */}
      <View style={estilos.estilosListaPersonasVentana.titulo}>
        <Text style={estilos.estilosListaPersonasVentana.tituloTexto}>
          Grupos de terapia
        </Text>
      </View>

      <View style={styles.contenido}>
        <Text style={styles.texto}> Grupos de terapia</Text>
      </View>
    </View>
  );
};

// Borrar estilos
const styles = StyleSheet.create({
  contenido: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  texto: {
    fontSize: 18,
    color: "#666",
  },
});

export default GruposScreen;
