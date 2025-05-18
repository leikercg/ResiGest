import React, { useState } from "react";
import { View, Text, Platform, Pressable } from "react-native";
import estilos from "../../../estilos/estilos";
import pickerStyles from "../../../estilos/pickerStyles";
import PersonasLista from "../../components/PersonasLista";
import DateTimePicker from "@react-native-community/datetimepicker";

const TareasScreen = ({ navigation }) => {
  const [fecha, setFecha] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false); // Control de visibilidad de fecha
  const manejarCambioFecha = (event, fechaSeleccionada) => {
    if (fechaSeleccionada) {
      if (Platform.OS === "android") {
        setMostrarPicker(false);
      }
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

      {/* Selector de fecha para iOS */}
      {Platform.OS === "ios" && (
        <View style={[pickerStyles.pickerFlotante, pickerStyles.pickerGrupos]}>
          <DateTimePicker
            value={fecha}
            mode="date"
            onChange={manejarCambioFecha}
            locale="es-ES"
            style={{
              borderRadius: 10,
            }}
          />
        </View>
      )}
      {/* Selector de fecha para Android */}
      {Platform.OS === "android" && (
        <View style={pickerStyles.pickerFlotante}>
          <Pressable onPress={() => setMostrarPicker(true)}>
            <Text style={pickerStyles.pickerFlotanteAndroid}>
              {fecha.toLocaleDateString("es-ES")}
            </Text>
          </Pressable>

          {mostrarPicker && (
            <DateTimePicker
              value={fecha}
              mode="date"
              onChange={manejarCambioFecha}
              locale="es-ES"
            />
          )}
        </View>
      )}
    </View>
  );
};

export default TareasScreen;
