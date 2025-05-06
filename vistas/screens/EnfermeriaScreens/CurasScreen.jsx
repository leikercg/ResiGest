import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import estilos from "../../../estilos/estilos";
import { AuthContext } from "../../../contexto/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import CurasControlador from "../../../controladores/curaControlador"; // Cambiado el import

const CurasScreen = ({ route }) => {
  // Estados
  const { user } = useContext(AuthContext);
  const { residente } = route.params;
  const [editando, setEditando] = useState(null);
  const [curas, setCuras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [zona, setZona] = useState("");
  const [observacion, setObservacion] = useState("");
  const [fechaCura, setFechaCura] = useState(new Date());

  // Efectos
  useEffect(() => {
    const desuscribirse = CurasControlador.obtenerCuras(
      residente.id,
      ({ curas }) => {
        setCuras(curas);
        setCargando(false);
      },
    );

    return () => desuscribirse();
  }, [residente.id]);

  const formatearFechaHora = (fecha) => {
    const date = fecha.toDate ? fecha.toDate() : new Date(fecha);
    return (
      date.toLocaleDateString() +
      " - " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Manejadores de eventos
  const manejarEditarCura = (cura) => {
    setEditando(cura);
    setZona(cura.zona);
    setObservacion(cura.observacion);
    setFechaCura(cura.fecha.toDate());
    setMostrarModal(true);
  };

  const manejarEliminarCura = (cura) => {
    Alert.alert(
      "Eliminar Cura",
      "¿Estás seguro de que deseas eliminar esta cura?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await CurasControlador.eliminarCura(cura.id);
              Alert.alert("Éxito", "Cura eliminada correctamente");
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
    );
  };

  const manejarCerrarModal = () => {
    setZona("");
    setObservacion("");
    setFechaCura(new Date());
    setEditando(null);
    setMostrarModal(false);
  };

  const manejarGuardadoCura = async () => {
    // Validar que todos los campos estén completos
    if (!zona.trim()) {
      Alert.alert("Error", "Debes especificar la zona de la cura");
      return;
    }

    if (!observacion.trim()) {
      Alert.alert("Error", "Debes ingresar una observación");
      return;
    }

    const ahora = new Date();

    if (fechaCura < ahora) {
      const esHoy = fechaCura.toDateString() === ahora.toDateString();

      if (!esHoy || (esHoy && fechaCura <= ahora)) {
        Alert.alert("Error", "Fecha y hora de visita inválidas");
        return;
      }
    }

    try {
      const residenteNombre = `${residente.nombre} ${residente.apellido}`;
      if (editando) {
        await CurasControlador.actualizarCura(
          editando.id,
          zona,
          observacion,
          fechaCura,
        );
        Alert.alert("Éxito", "Cura actualizada correctamente");
      } else {
        await CurasControlador.crearCura(
          residente.id,
          zona,
          observacion,
          fechaCura,
          user.uid,
          residenteNombre,
          console.log(residenteNombre), // DEBUGGGGGGG
        );
        Alert.alert("Éxito", "Cura creada correctamente");
      }
      manejarCerrarModal();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const manejarCambioFecha = (event, selectedDate) => {
    setFechaCura(selectedDate || fechaCura);
  };

  const manejarCambioHora = (event, selectedTime) => {
    setFechaCura(selectedTime || fechaCura);
  };

  // Renderizado condicional
  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Renderizado de items
  const renderItem = ({ item }) => {
    const esMiCura = item.usuarioId === user?.uid;
    const ahora = new Date();
    const fechaItem = item.fecha.toDate();

    const esHoy = fechaItem.toDateString() === ahora.toDateString();
    const esFutura = fechaItem > ahora;
    const puedeEditar = esFutura || (esHoy && fechaItem > ahora);
    const esPasada = fechaItem < ahora && !esHoy;
    const mostrarBotones = esMiCura && puedeEditar;

    let colorFondo = styles.curaItem;
    if (esHoy) {
      colorFondo = [styles.curaItem, { backgroundColor: "#D4EDDA" }]; // Color verde si es hoy
    } else if (esPasada) {
      colorFondo = [styles.curaItem, { backgroundColor: "#F8D7DA" }]; // Color rojo si ya ha pasado
    }

    return (
      <Pressable style={colorFondo}>
        <View style={styles.curaContenido}>
          <View style={styles.infoCura}>
            <View style={styles.curaHeader}>
              <Ionicons name="calendar" size={20} color="#0000FF" />
              <Text style={styles.curaFecha}>
                {formatearFechaHora(item.fecha)}
              </Text>
            </View>
            <Text style={styles.curaZona}>Zona: {item.zona}</Text>
            {item.observacion && (
              <Text style={styles.curaObservacion}>
                Observación: {item.observacion}
              </Text>
            )}
            <Text style={styles.curaUsuario}>
              Registrado por: {item.usuarioNombre || item.usuarioId}
            </Text>
          </View>

          {mostrarBotones && (
            <View style={styles.iconosAcciones}>
              <Pressable
                onPress={() => manejarEditarCura(item)}
                style={styles.iconoBoton}
              >
                <Ionicons name="pencil" size={20} color="#2D9CDB" />
              </Pressable>
              <Pressable
                onPress={() => manejarEliminarCura(item)}
                style={styles.iconoBoton}
              >
                <Ionicons name="close" size={20} color="#EB5757" />
              </Pressable>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={estilos.estilosListaPersonasVentana.contenedor}>
      {/* Cabecera */}
      <View style={estilos.estilosListaPersonasVentana.titulo}>
        <Text style={estilos.estilosListaPersonasVentana.tituloTexto}>
          Registro de Curas
        </Text>
      </View>
      <Text style={styles.subtituloTexto}>
        {residente.nombre} {residente.apellido}
      </Text>

      {/* Lista principal */}
      <FlatList
        data={curas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay curas registradas</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal de agregar/editar */}
      <Modal
        visible={mostrarModal}
        animationType="slide"
        transparent={true}
        onRequestClose={manejarCerrarModal}
      >
        <TouchableWithoutFeedback onPress={manejarCerrarModal}>
          <View style={styles.contenedorModal}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.contenidoModal}
            >
              <Text style={styles.modalTitulo}>
                {editando ? "Editar Cura" : "Nueva Cura"}
              </Text>

              <Text style={styles.label}>Zona tratada:</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Pierna derecha, espalda..."
                value={zona}
                onChangeText={setZona}
              />

              <Text style={styles.label}>Observaciones:</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Detalles adicionales sobre la cura"
                value={observacion}
                onChangeText={setObservacion}
                multiline
              />

              <Text style={styles.label}>Fecha y hora:</Text>
              <View style={styles.dateTimeContainer}>
                <View style={styles.dateTimeButton}>
                  <DateTimePicker
                    value={fechaCura}
                    mode="date"
                    display="default"
                    locale="es-ES"
                    onChange={manejarCambioFecha}
                  />
                </View>
                <View style={styles.dateTimeButton}>
                  <DateTimePicker
                    value={fechaCura}
                    mode="time"
                    display="default"
                    onChange={manejarCambioHora}
                  />
                </View>
              </View>

              <View style={styles.contenedorBotones}>
                <Pressable
                  style={[styles.botonModal, styles.botonCancelar]}
                  onPress={manejarCerrarModal}
                >
                  <Text style={styles.textoBotonModal}>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={[styles.botonModal, styles.botonGuardar]}
                  onPress={() =>
                    Alert.alert(
                      "Confirmar",
                      editando
                        ? "¿Estás seguro de que deseas actualizar esta cura?"
                        : "¿Estás seguro de que deseas crear esta cura?",
                      [
                        { text: "Cancelar", style: "cancel" },
                        {
                          text: editando ? "Actualizar" : "Crear",
                          onPress: manejarGuardadoCura,
                        },
                      ],
                    )
                  }
                >
                  <Text style={styles.textoBotonModal}>
                    {editando ? "Actualizar" : "Crear"}
                  </Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Botón flotante */}
      <Pressable
        style={({ pressed }) => [
          estilos.botonFLotante.botonFLotante,
          { opacity: pressed ? 0.6 : 1 },
        ]}
        onPress={() => setMostrarModal(true)}
      >
        <Text style={estilos.botonFLotante.buttonText}>+</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  curaItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  curaZona: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  curaObservacion: {
    fontSize: 14,
    marginBottom: 5,
    color: "#555",
    fontStyle: "italic",
  },
  curaUsuario: {
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
  botonAgregar: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#2F80ED",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  subtituloTexto: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 4,
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
  iconosAcciones: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconoBoton: {
    padding: 6,
    borderRadius: 6,
  },
  // Estilos del modal
  contenedorModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  contenidoModal: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  input: {
    height: 40,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dateTimeButton: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  contenedorBotones: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 20,
  },
  botonModal: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  botonCancelar: {
    backgroundColor: "#CCC",
  },
  botonGuardar: {
    backgroundColor: "#0000FF",
  },
  textoBotonModal: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CurasScreen;
