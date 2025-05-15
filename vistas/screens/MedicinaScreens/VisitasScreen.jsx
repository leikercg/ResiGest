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
import VisitasControlador from "../../../controladores/vistaControlador";

const VisitasScreen = ({ route }) => {
  // Estados
  const { user } = useContext(AuthContext);
  const { residente } = route.params;
  const [editando, setEditando] = useState(null);
  const [visitas, setVisitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [fechaVisita, setFechaVisita] = useState(new Date());

  // Efectos
  useEffect(() => {
    const desuscribirse = VisitasControlador.obtenerVisitas(
      residente.id,
      ({ visitas }) => {
        setVisitas(visitas);
        setCargando(false);
      },
    );

    return () => desuscribirse();
  }, [residente.id]);

  // Funciones complementarias
  const formatearFechaHora = (fecha) => {
    const date = fecha.toDate ? fecha.toDate() : new Date(fecha);
    return (
      date.toLocaleDateString() +
      " - " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Manejadores de eventos
  const manejarEditarVisita = (visita) => {
    setEditando(visita);
    setMotivo(visita.motivo);
    setFechaVisita(visita.fecha.toDate());
    setMostrarModal(true);
  };

  const manejarEliminarVisita = (visita) => {
    Alert.alert(
      "Eliminar Visita",
      "¿Estás seguro de que deseas eliminar esta visita?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await VisitasControlador.eliminarVisita(visita.id);
              Alert.alert("Éxito", "Visita eliminada correctamente");
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
    setFechaVisita(new Date());
    setEditando(null);
    setMostrarModal(false);
  };

  const manejarGuardadoVisita = async () => {
    if (!motivo.trim()) {
      Alert.alert("Error", "Debes ingresar un motivo para la visita");
      return;
    }

    const ahora = new Date();

    if (fechaVisita < ahora) {
      const esHoy = fechaVisita.toDateString() === ahora.toDateString();

      if (!esHoy || (esHoy && fechaVisita <= ahora)) {
        Alert.alert("Error", "Fecha y hora de visita inválidas");
        return;
      }
    }

    try {
      const residenteNombre = `${residente.nombre} ${residente.apellido}`;

      if (editando) {
        await VisitasControlador.actualizarVisita(
          editando.id,
          motivo,
          fechaVisita,
        );
        Alert.alert("Éxito", "Visita actualizada correctamente");
      } else {
        await VisitasControlador.crearVisita(
          residente.id,
          motivo,
          fechaVisita,
          user.uid,
          residenteNombre,
        );
        Alert.alert("Éxito", "Visita creada correctamente");
      }
      manejarCerrarModal();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const manejarCambioFecha = (event, selectedDate) => {
    setFechaVisita(selectedDate || fechaVisita);
  };

  const manejarCambioHora = (event, selectedTime) => {
    setFechaVisita(selectedTime || fechaVisita);
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
    const esMiVisita = item.usuarioId === user?.uid;
    const ahora = new Date();
    const fechaItem = item.fecha.toDate();

    const esHoy = fechaItem.toDateString() === ahora.toDateString();
    const esFutura = fechaItem > ahora;
    const esPasada = fechaItem < ahora && !esHoy;
    const puedeEditar = esFutura || (esHoy && fechaItem > ahora);
    const mostrarBotones = esMiVisita && puedeEditar;

    let colorFondo = styles.visitaItem;
    if (esHoy) {
      colorFondo = [styles.visitaItem, { backgroundColor: "#D4EDDA" }]; // Color verde si es hoy
    } else if (esPasada) {
      colorFondo = [styles.visitaItem, { backgroundColor: "#F8D7DA" }]; // Color rojo si ya ha pasado
    }

    return (
      <Pressable style={colorFondo}>
        <View style={styles.visitaContenido}>
          <View style={styles.infoVisita}>
            <View style={styles.visitaHeader}>
              <Ionicons name="calendar" size={20} color="#0000FF" />
              <Text style={styles.visitaFecha}>
                {formatearFechaHora(item.fecha)}
              </Text>
            </View>
            <Text style={styles.visitaMotivo}>{item.motivo}</Text>
            <Text style={styles.visitaUsuario}>
              Registrado por: {item.usuarioNombre || item.usuarioId}
            </Text>
          </View>

          {mostrarBotones && (
            <View style={styles.iconosAcciones}>
              <Pressable
                onPress={() => manejarEditarVisita(item)}
                style={styles.iconoBoton}
              >
                <Ionicons name="pencil" size={20} color="#2D9CDB" />
              </Pressable>
              <Pressable
                onPress={() => manejarEliminarVisita(item)}
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
          Visitas Programadas
        </Text>
      </View>
      <Text style={styles.subtituloTexto}>
        {residente.nombre} {residente.apellido}
      </Text>

      {/* Lista principal */}
      <FlatList
        data={visitas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay visitas registradas</Text>
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
                {editando ? "Editar Visita" : "Nueva Visita"}
              </Text>

              <Text style={styles.label}>Motivo:</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingrese el motivo de la visita"
                value={motivo}
                onChangeText={setMotivo}
                multiline
              />

              <Text style={styles.label}>Fecha y hora:</Text>
              <View style={styles.dateTimeContainer}>
                <View style={styles.dateTimeButton}>
                  <DateTimePicker
                    value={fechaVisita}
                    mode="date"
                    display="default"
                    locale="es-ES"
                    onChange={manejarCambioFecha}
                  />
                </View>
                <View style={styles.dateTimeButton}>
                  <DateTimePicker
                    value={fechaVisita}
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
                  style={[styles.botonModal, styles.botonAgregar]}
                  onPress={() =>
                    Alert.alert(
                      "Confirmar",
                      editando
                        ? "¿Estás seguro de que deseas actualizar esta visita?"
                        : "¿Estás seguro de que deseas crear esta visita?",
                      [
                        { text: "Cancelar", style: "cancel" },
                        {
                          text: editando ? "Actualizar" : "Crear",
                          onPress: manejarGuardadoVisita,
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
  visitaItem: {
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
  visitaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  visitaFecha: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
  visitaMotivo: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  visitaUsuario: {
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
  visitaContenido: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  infoVisita: {
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

export default VisitasScreen;
