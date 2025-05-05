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
import TareaControlador from "../../../controladores/tareaControlador";
import estilos from "../../../estilos/estilos";
import { Ionicons } from "@expo/vector-icons";

const AgendaAuxScreen = () => {
  // Obtener el usuario actual del contexto
  const { user } = useContext(AuthContext);
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Suscribirse a las tareas del usuario
    const desuscribirse = TareaControlador.obtenerTareasPorUsuarioYFecha(
      user.uid,
      new Date(),
      (tareasObtenidas) => {
        setTareas(tareasObtenidas);
        setCargando(false);
      },
    );

    return () => desuscribirse();
  }, [user]);

  const renderItem = ({ item }) => (
    <Pressable style={styles.tareaItem}>
      <View style={styles.tareaContenido}>
        <View style={styles.infotarea}>
          <View style={styles.tareaHeader}>
            <Ionicons name="time" size={20} color="#0000FF" />
            <Text style={styles.tareaFecha}>
              {item.fecha.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </Text>
          </View>
          <Text style={styles.tareaMotivo}>{item.descripcion}</Text>
          <Text style={styles.tareaUsuario}>
            Residente: {item.residenteNombre}
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
          Mis Tareas
        </Text>
      </View>

      {/* Lista principal */}
      <FlatList
        data={tareas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No tienes tareas asignadas para hoy
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  tareaItem: {
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
  tareaContenido: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  infotarea: {
    flex: 1,
    paddingRight: 10,
  },
  tareaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tareaFecha: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
  tareaMotivo: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  tareaUsuario: {
    fontSize: 12,
    color: "#777",
    fontStyle: "italic",
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
});

export default AgendaAuxScreen;
