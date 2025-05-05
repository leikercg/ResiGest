import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import estilos from "../../../estilos/estilos";
import PersonasLista from "../../components/PersonasLista";
import DateTimePicker from "@react-native-community/datetimepicker";

const TareasScreen = ({ navigation }) => {
  const [fecha, setFecha] = useState(new Date());

  const cambioFecha = (event, fechaSeleccionada) => {
    if (fechaSeleccionada) {
      setFecha(fechaSeleccionada);
    }
  };

  return (
    <View style={estilos.estilosListaPersonasVentana.contenedor}>
      {/* Encabezado con título */}
      <View style={estilos.estilosListaPersonasVentana.titulo}>
        <Text style={estilos.estilosListaPersonasVentana.tituloTexto}>
          Tareas
        </Text>
      </View>

      {/* Lista de empleados */}
      <PersonasLista
        navigation={navigation}
        tipo="empleado"
        filtro={{ departamento: 7 }}
        fechaSeleccionada={fecha}
      />

      {/* Picker flotante abajo a la derecha */}
      <View style={styles.pickerFlotante}>
        <DateTimePicker
          value={fecha}
          mode="date"
          onChange={cambioFecha}
          locale="es-ES"
          style={{
            borderRadius: 10,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerFlotante: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 4,
    zIndex: 10,
  },
});

export default TareasScreen;
