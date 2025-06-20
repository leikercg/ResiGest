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
import pickerStyles from "../../../estilos/pickerStyles";
import { AuthContext } from "../../../contexto/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import SesionesControlador from "../../../controladores/sesionCotrolador";

const SesionesScreen = ({ route }) => {
  const { user } = useContext(AuthContext);
  const { residente } = route.params;
  const [editando, setEditando] = useState(null);
  const [sesiones, setSesiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [descripcion, setMotivo] = useState("");
  const [fechaSesion, setFechaSesion] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [mostrarTimePicker, setMostrarTimePicker] = useState(false);

  useEffect(() => {
    const desuscribirse = SesionesControlador.obtenerSesiones(
      residente.id,
      ({ sesiones }) => {
        setSesiones(sesiones);
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

  const manejarEditarSesion = (sesion) => {
    setEditando(sesion);
    setMotivo(sesion.descripcion);
    setFechaSesion(sesion.fecha.toDate());
    setMostrarModal(true);
  };

  const manejarEliminarSesion = (sesion) => {
    Alert.alert(
      "Eliminar Sesión",
      "¿Estás seguro de que deseas eliminar esta sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await SesionesControlador.eliminarSesion(sesion.id);
              Alert.alert("Éxito", "Sesión eliminada correctamente");
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
    );
  };

  const manejarCerrarModal = () => {
    setMotivo("");
    setFechaSesion(new Date());
    setEditando(null);
    setMostrarModal(false);
  };

  const manejarGuardadoSesion = async () => {
    if (!descripcion.trim()) {
      Alert.alert("Error", "Debes ingresar un descripción para la sesión");
      return;
    }

    const ahora = new Date();

    if (fechaSesion < ahora) {
      const esHoy = fechaSesion.toDateString() === ahora.toDateString();

      if (!esHoy || (esHoy && fechaSesion <= ahora)) {
        Alert.alert("Error", "Fecha y hora de sesión inválidas");
        return;
      }
    }

    try {
      const residenteNombre = `${residente.nombre} ${residente.apellido}`;

      if (editando) {
        await SesionesControlador.actualizarSesion(
          editando.id,
          descripcion,
          fechaSesion,
        );
        Alert.alert("Éxito", "Sesión actualizada correctamente");
      } else {
        await SesionesControlador.crearSesion(
          residente.id,
          descripcion,
          fechaSesion,
          user.uid,
          residenteNombre,
        );
        Alert.alert("Éxito", "Sesión creada correctamente");
      }
      manejarCerrarModal();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const manejarCambioFecha = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setMostrarPicker(false);
    }
    setFechaSesion(selectedDate || fechaSesion);
  };

  const manejarCambioHora = (event, selectedTime) => {
    if (Platform.OS === "android") {
      setMostrarTimePicker(false);
    }
    setFechaSesion(selectedTime || fechaSesion);
  };

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Renderizado de items
  const renderItem = ({ item }) => {
    const esMiSesion = item.usuarioId === user?.uid;
    const ahora = new Date();
    const fechaItem = item.fecha.toDate();

    const esHoy = fechaItem.toDateString() === ahora.toDateString();
    const esFutura = fechaItem > ahora;
    const esPasada = fechaItem < ahora && !esHoy;
    const puedeEditar = esFutura || (esHoy && fechaItem > ahora);
    const mostrarBotones = esMiSesion && puedeEditar;

    let colorFondo = styles.sesionItem;
    if (esHoy) {
      colorFondo = [styles.sesionItem, { backgroundColor: "#D4EDDA" }]; // Color verde si es hoy
    } else if (esPasada) {
      colorFondo = [styles.sesionItem, { backgroundColor: "#F8D7DA" }]; // Color rojo si ya ha pasado
    }

    return (
      <Pressable style={colorFondo}>
        <View style={styles.sesionContenido}>
          <View style={styles.infoSesion}>
            <View style={styles.sesionHeader}>
              <Ionicons name="calendar" size={20} color="#0000FF" />
              <Text style={styles.sesionFecha}>
                {formatearFechaHora(item.fecha)}
              </Text>
            </View>
            <Text style={styles.sesionMotivo}>
              Descripción: {item.descripcion}
            </Text>
            <Text style={styles.sesionUsuario}>
              Registrado por: {item.usuarioNombre || item.usuarioId}
            </Text>
          </View>

          {mostrarBotones && (
            <View style={styles.iconosAcciones}>
              <Pressable
                onPress={() => manejarEditarSesion(item)}
                style={styles.iconoBoton}
              >
                <Ionicons name="pencil" size={20} color="#2D9CDB" />
              </Pressable>
              <Pressable
                onPress={() => manejarEliminarSesion(item)}
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
          Sesiones Programadas
        </Text>
      </View>
      <Text style={styles.subtituloTexto}>
        {residente.nombre} {residente.apellido}
      </Text>

      {/* Lista principal */}
      <FlatList
        data={sesiones}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay sesiones registradas</Text>
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
            <TouchableWithoutFeedback onPress={() => {}}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.contenidoModal}
              >
                <Text style={styles.modalTitulo}>
                  {editando ? "Editar Sesión" : "Nueva Sesión"}
                </Text>

                <Text style={styles.label}>Descripción:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese el descripción de la sesion"
                  value={descripcion}
                  onChangeText={setMotivo}
                  multiline
                />

                <Text style={styles.label}>Fecha y hora:</Text>
                <View style={pickerStyles.dateTimeContainer}>
                  {/* Selector de fecha para iOS */}
                  {Platform.OS === "ios" && (
                    <View style={pickerStyles.dateTimeButton}>
                      <DateTimePicker
                        value={fechaSesion}
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
                    <View style={pickerStyles.dateTimeButtonAndroid}>
                      <Pressable onPress={() => setMostrarPicker(true)}>
                        <Text>{fechaSesion.toLocaleDateString("es-ES")}</Text>
                      </Pressable>

                      {mostrarPicker && (
                        <DateTimePicker
                          value={fechaSesion}
                          mode="date"
                          onChange={manejarCambioFecha}
                          locale="es-ES"
                        />
                      )}
                    </View>
                  )}
                  {/* Selector de hora para iOS - Siempre visible */}
                  {Platform.OS === "ios" && (
                    <View style={pickerStyles.dateTimeButton}>
                      <DateTimePicker
                        value={fechaSesion}
                        mode="time"
                        onChange={manejarCambioHora}
                        locale="es-ES"
                        style={{ borderRadius: 10 }}
                      />
                    </View>
                  )}

                  {/* Selector de hora para Android - Se muestra al presionar */}
                  {Platform.OS === "android" && (
                    <View style={pickerStyles.dateTimeButtonAndroid}>
                      <Pressable onPress={() => setMostrarTimePicker(true)}>
                        <Text>
                          {fechaSesion.toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </Pressable>

                      {mostrarTimePicker && (
                        <DateTimePicker
                          value={fechaSesion}
                          mode="time"
                          onChange={(event, time) => {
                            setMostrarTimePicker(false);
                            manejarCambioHora(event, time);
                          }}
                          locale="es-ES"
                        />
                      )}
                    </View>
                  )}
                </View>

                <View style={styles.contenedorBotones}>
                  <Pressable
                    style={[styles.botonModal, styles.botonCancelar]}
                    onPress={manejarCerrarModal}
                  >
                    <Text style={styles.textoBotonModal}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.botonModal, styles.botonAgregar]}
                    onPress={() =>
                      Alert.alert(
                        "Confirmar",
                        editando
                          ? "¿Estás seguro de que deseas actualizar esta sesión?"
                          : "¿Estás seguro de que deseas crear esta sesión?",
                        [
                          { text: "Cancelar", style: "cancel" },
                          {
                            text: editando ? "Actualizar" : "Crear",
                            onPress: manejarGuardadoSesion,
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
            </TouchableWithoutFeedback>
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
  sesionItem: {
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
  sesionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sesionFecha: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
  sesionMotivo: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  sesionUsuario: {
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
  addButton: {
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
  sesionContenido: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  infoSesion: {
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
  // Estilos de ventana modal
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
    height: 100,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: "top",
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
  botonAgregar: {
    backgroundColor: "#0000FF",
  },
  textoBotonModal: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SesionesScreen;
