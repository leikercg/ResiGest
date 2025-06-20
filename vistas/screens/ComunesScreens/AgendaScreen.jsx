import React, { useContext, useState, useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  Platform,
  Pressable,
} from "react-native";
import { AuthContext } from "../../../contexto/AuthContext";
import EmpladoControlador from "../../../controladores/empleadoControlador";
import estilos from "../../../estilos/estilos";
import pickerStyles from "../../../estilos/pickerStyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import AgendaItem from "./../../components/AgendaItem";
import { useTranslation } from "react-i18next";

const AgendaScreen = () => {
  const [fecha, setFecha] = useState(new Date());
  const { user, departamentoId } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const { t } = useTranslation();

  const manejarCambioFecha = (event, fechaSeleccionada) => {
    // Para Android, necesitamos ocultar el picker después de seleccionar
    if (Platform.OS === "android") {
      setMostrarPicker(false);
    }

    if (fechaSeleccionada) {
      setFecha(fechaSeleccionada);
    }
  };
  useEffect(() => {
    if (departamentoId === 2) {
      // Si el departamento es 2, buscamos las visitas
      const desuscribirse = EmpladoControlador.obtenerVisitasPorEmpleadoYFecha(
        user.uid,
        fecha,
        (visitasObtenidas) => {
          setData(visitasObtenidas);
          setCargando(false);
        },
      );

      return () => desuscribirse();
    }

    if (departamentoId === 3) {
      // Si el departamento es 3, buscamos las curas
      const desuscribirse = EmpladoControlador.obtenerCurasPorEmpleadoYFecha(
        user.uid,
        fecha,
        (curasObtenidas) => {
          setData(curasObtenidas);
          setCargando(false);
        },
      );

      return () => desuscribirse();
    }
    if (departamentoId === 5) {
      // Si el departamento es 5, buscamos las sesiones de fisioterapia
      const desuscribirse = EmpladoControlador.obtenerSesionesPorEmpleadoYFecha(
        user.uid,
        fecha,
        (sesionesObtenidas) => {
          setData(sesionesObtenidas);
          setCargando(false);
        },
      );

      return () => desuscribirse();
    }
    if (departamentoId === 6) {
      // Si el departamento es 6, buscamos las sesiones de terapia ocupacional
      const desuscribirse = EmpladoControlador.obtenerGruposPorEmpleadoYFecha(
        user.uid,
        fecha,
        (gruposObtenidos) => {
          setData(gruposObtenidos);
          setCargando(false);
        },
      );

      return () => desuscribirse();
    }
  }, [user, fecha, departamentoId]);
  const getTipoPorDepartamento = (departamentoId) => {
    switch (departamentoId) {
      case 2:
        return "visita";
      case 3:
        return "cura";
      case 5:
        return "sesion";
      case 6:
        return "grupo";
      default:
        return null;
    }
  };

  const renderItem = ({ item }) => (
    <AgendaItem item={item} tipo={getTipoPorDepartamento(departamentoId)} />
  );

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
          {t("agendaTitulo")}
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.contenedorVacio}>
            <Text style={styles.textoVacio}>{t("agendaNoRegistros")} </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      {/* Selector de fecha para iOS */}
      {Platform.OS === "ios" && (
        <View style={pickerStyles.pickerFlotante}>
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
});

export default AgendaScreen;
