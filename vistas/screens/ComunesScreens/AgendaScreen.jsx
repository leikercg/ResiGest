import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { AuthContext } from "../../../contexto/AuthContext";
import EmpladoControlador from "../../../controladores/empleadoControlador";
import estilos from "../../../estilos/estilos";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const AgendaScreen = () => {
  const [fecha, setFecha] = useState(new Date());
  const { user } = useContext(AuthContext);
  const [curas, setCuras] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cambioFecha = (event, fechaSeleccionada) => {
    if (fechaSeleccionada) {
      setFecha(fechaSeleccionada);
    }
  };

  useEffect(() => {
    const desuscribirse = EmpladoControlador.obtenerCurasPorEmpleadoYFecha(
      user.uid,
      fecha,
      (curasObtenidas) => {
        setCuras(curasObtenidas);
        setCargando(false);
      },
    );

    return () => desuscribirse();
  }, [user, fecha]); // Dependencia añadida: fecha

  const renderItem = ({ item }) => (
    <Pressable style={styles.curaItem}>
      <View style={styles.curaContenido}>
        <View style={styles.infoCura}>
          <View style={styles.curaHeader}>
            <Ionicons name="time" size={20} color="#0000FF" />
            <Text style={styles.curaFecha}>
              {item.fecha.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </Text>
          </View>
          <Text style={styles.curaObservacion}>{item.observacion}</Text>
          <Text style={styles.curaZona}>Zona: {item.zona}</Text>
          <Text style={styles.curaResidente}>
            Residente ID: {item.residenteNombreCompleto}
          </Text>
        </View>
      </View>
    </Pressable>
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
      {/* Cabecera */}
      <View style={estilos.estilosListaPersonasVentana.titulo}>
        <Text style={estilos.estilosListaPersonasVentana.tituloTexto}>
          Agenda
        </Text>
      </View>

      {/* Lista principal */}
      <FlatList
        data={curas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No tienes curas registradas para este día
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  contenedorCargando: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  curaItem: {
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
  curaContenido: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  infoCura: {
    flex: 1,
    paddingRight: 10,
  },
  curaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  curaFecha: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
  curaObservacion: {
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
  curaResidente: {
    fontSize: 12,
    color: "#777",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#999",
  },
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

export default AgendaScreen;
