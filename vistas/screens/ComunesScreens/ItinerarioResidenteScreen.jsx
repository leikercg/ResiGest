import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";
import ResidenteControlador from "../../../controladores/residenteControlador";
import estilos from "../../../estilos/estilos";
import DateTimePicker from "@react-native-community/datetimepicker";
import CuraItem from "./../../components/CuraItem";
import VisitaItem from "./../../components/VisitaItem";
import SesionItem from "./../../components/SesionItem";
import GrupoItem from "./../../components/GrupoItem";
import TareaItem from "./../../components/TareaItem";
const ItinerarioResidenteScreen = ({ route }) => {
  const { residente } = route.params;
  const nombreResidente = `${residente.nombre} ${residente.apellido}`;
  const [fecha, setFecha] = useState(new Date());
  const [data, setData] = useState([]); // Puede ser curas o visitas
  const [cargando, setCargando] = useState(true);

  const cambioFecha = (event, fechaSeleccionada) => {
    if (fechaSeleccionada) {
      setFecha(fechaSeleccionada);
    }
  };

  useEffect(() => {
    const desuscribirse = ResidenteControlador.obtenerItinerarioResidente(
      residente.id, // o residenteId según tu modelo
      fecha,
      (itinerario) => {
        setData(itinerario);
        setCargando(false);
      },
    );

    return () => desuscribirse();
  }, [fecha, residente.id]);

  const renderItem = ({ item }) => {
    switch (item.tipo) {
      case "visita":
        return <VisitaItem item={item} />;
      case "cura":
        return <CuraItem item={item} />;
      case "sesion":
        return <SesionItem item={item} />;
      case "grupo":
        return <GrupoItem item={item} />;
      case "tarea":
        return <TareaItem item={item} />;
      default:
        return null;
    }
  };

  if (cargando) {
    return (
      <View style={styles.contenedorCargando}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={estilos.estilosListaPersonasVentana.contenedor}>
      <View style={estilos.estilosListaPersonasVentana.titulo}>
        <Text style={estilos.estilosListaPersonasVentana.tituloTexto}>
          Agenda de {nombreResidente}
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.contenedorVacio}>
            <Text style={styles.textoVacio}>
              No hay registros para este día
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

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
  contenedorCargando: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 20,
    minHeight: "100%",
  },
  estiloItem: {
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  estiloContenedor: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  estiloInfo: {
    flex: 1,
    paddingRight: 10,
  },
  estiloCabecera: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  curaFecha: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
  estiloResidente: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  curaZona: {
    fontSize: 12,
    color: "#777",
    fontStyle: "italic",
    marginBottom: 3,
  },
  curaObseervacion: {
    fontSize: 12,
    color: "#777",
  },
  contenedorVacio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  textoVacio: {
    marginTop: 10,
    fontSize: 16,
    color: "#999",
  },
  pickerFlotante: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

export default ItinerarioResidenteScreen;
