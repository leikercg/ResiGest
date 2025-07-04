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
  TextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import estilos from "../../../estilos/estilos";
import pickerStyles from "../../../estilos/pickerStyles";
import { AuthContext } from "../../../contexto/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import GrupoControlador from "../../../controladores/grupoControlador";
import ResidenteControlador from "../../../controladores/residenteControlador";

const GruposScreen = ({ route }) => {
  const { user } = useContext(AuthContext);
  const { residente } = route.params || {};
  const [editando, setEditando] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [fechaGrupo, setFechaGrupo] = useState(new Date());
  const [listaResidentes, setListaResidentes] = useState([]);
  const [residentesSeleccionados, setResidentesSeleccionados] = useState([]);
  const [mostrarSelectorResidente, setMostrarSelectorResidente] =
    useState(false);
  const [fechaFiltro, setFechaFiltro] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [mostrarTimePicker, setMostrarTimePicker] = useState(false);

  const manejarCambioFechaFiltro = (event, fechaSeleccionada) => {
    if (Platform.OS === "android") {
      setMostrarPicker(false);
    }
    if (fechaSeleccionada) {
      setFechaFiltro(fechaSeleccionada);
    }
  };
  useEffect(() => {
    let desuscribirse;

    const cargarGrupos = async () => {
      setCargando(true);

      try {
        if (residente?.id) {
          // Caso con residente
          desuscribirse = GrupoControlador.obtenerGruposPorResidente(
            residente.id,
            (grupos) => {
              setGrupos(grupos);
              setCargando(false);
            },
          );
        } else {
          // Caso sin residente, buscar grupos por fecha seleccionada
          desuscribirse = GrupoControlador.obtenerTodosLosGrupos(
            fechaFiltro,
            (grupos) => {
              setGrupos(grupos);
              setCargando(false);
            },
          );
        }
      } catch (error) {
        console.error("Error cargando grupos:", error);
        setCargando(false);
      }
    };

    cargarGrupos();

    return () => {
      if (desuscribirse) desuscribirse();
    };
  }, [residente?.id, fechaFiltro]);

  useEffect(() => {
    const desuscribirse =
      ResidenteControlador.listarResidentes(setListaResidentes);
    return () => desuscribirse();
  }, []);

  const formatearFechaHora = (fecha) => {
    const date = fecha.toDate ? fecha.toDate() : new Date(fecha);
    return (
      date.toLocaleDateString() +
      " - " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const manejarEditarGrupo = (grupo) => {
    const fechaGrupo = grupo.fecha.toDate
      ? grupo.fecha.toDate()
      : new Date(grupo.fecha);

    setEditando(grupo);
    setDescripcion(grupo.descripcion);
    setFechaGrupo(fechaGrupo);

    const residentesCompletos = grupo.residentes
      ? listaResidentes.filter((residente) =>
          grupo.residentes.includes(residente.id),
        )
      : [];

    setResidentesSeleccionados(residentesCompletos);
    setMostrarModal(true);
  };

  const manejarCerrarModal = () => {
    setDescripcion("");
    setFechaGrupo(new Date());
    setEditando(null);
    setMostrarModal(false);
    setResidentesSeleccionados([]); // Reseteamos la lista seleccionada
    setMostrarSelectorResidente(false);
  };

  const manejarEliminarGrupo = (grupo) => {
    Alert.alert(
      "Eliminar residente",
      "¿Estás seguro de remover a este residente del grupo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const resultado = await GrupoControlador.eliminargrupo(grupo.id);
              if (resultado.eliminado) {
                Alert.alert("Éxito", "Grupo eliminado con éxito");
              }
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
    );
  };

  const manejarCambioFecha = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setMostrarPicker(false);
    }
    const fechaActual = selectedDate || fechaGrupo;
    setFechaGrupo(fechaActual);
  };
  const manejarCambioHora = (event, selectedTime) => {
    if (Platform.OS === "android") {
      setMostrarTimePicker(false);
    }
    setFechaGrupo(selectedTime || fechaGrupo);
  };

  const manejarGuardadoGrupo = async () => {
    if (!descripcion.trim()) {
      Alert.alert("Error", "Debes ingresar una descripción para el grupo");
      return;
    }

    // Debe haber al menos un residente
    if (!editando && residentesSeleccionados.length === 0) {
      Alert.alert(
        "Error",
        "Debes seleccionar al menos un residente para el grupo",
      );
      return;
    }
    const ahora = new Date();
    if (fechaGrupo < ahora) {
      const esHoy = fechaGrupo.toDateString() === ahora.toDateString();

      if (!esHoy || (esHoy && fechaGrupo <= ahora)) {
        Alert.alert("Error", "Fecha y hora de grupo inválidas");
        return;
      }
    }

    try {
      if (editando) {
        // Modo edición
        await GrupoControlador.actualizarGrupo(editando.id, {
          descripcion: descripcion.trim(),
          fecha: fechaGrupo,
          residentesSeleccionados: residentesSeleccionados.map((r) => r.id), // Solo enviamos los IDs
        });
        Alert.alert("Éxito", "Grupo actualizado correctamente");
      } else {
        // Obtener los IDs de los residentes seleccionados
        const idsSeleccionados = residentesSeleccionados.map((r) => r.id);

        // Modo creación: crear nuevo grupo
        await GrupoControlador.crearGrupo(
          descripcion.trim(),
          user.uid,
          idsSeleccionados,
          fechaGrupo,
        );
        Alert.alert("Éxito", "Grupo creado correctamente");
      }

      manejarCerrarModal();
    } catch (error) {
      const mensajeError =
        error?.message || "Ocurrió un error inesperado. Inténtalo de nuevo.";
      Alert.alert("Error", mensajeError);
      console.error("Error al guardar grupo:", error);
    }
  };

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const renderItem = ({ item }) => {
    const esMiGrupo = item.usuarioId === user?.uid;
    const ahora = new Date();
    const fechaItem = item.fecha.toDate
      ? item.fecha.toDate()
      : new Date(item.fecha);
    const yaPasado = fechaItem < ahora;
    const esHoy = fechaItem.toDateString() === ahora.toDateString();
    const mostrarEdicion = esMiGrupo && !yaPasado;
    const mostrarEliminacion = esMiGrupo && !yaPasado && !residente;

    let colorFondo = styles.grupoItem;
    const residenteValido = residente && residente.id; // Para no motar colores en la lista de todos los grupos

    if (esHoy && residenteValido) {
      colorFondo = [styles.grupoItem, { backgroundColor: "#D4EDDA" }]; // Hoy - verde
    } else if (yaPasado && residenteValido) {
      colorFondo = [styles.grupoItem, { backgroundColor: "#F8D7DA" }]; // Pasado - rojo
    }

    return (
      <Pressable style={colorFondo}>
        <View style={styles.grupoContenido}>
          <View style={styles.infoGrupo}>
            <View style={styles.grupoHeader}>
              <Ionicons name="calendar" size={20} color="#0000FF" />
              <Text style={styles.grupoFecha}>
                {formatearFechaHora(item.fecha)}
                {yaPasado && <Text style={styles.textoRealizado}></Text>}
              </Text>
            </View>
            <Text style={styles.grupoDescripcion}>{item.descripcion}</Text>
            <Text style={styles.grupoUsuario}>
              Creado por: {item.usuarioNombre}
            </Text>
          </View>

          {(mostrarEdicion || mostrarEliminacion) && (
            <View style={styles.iconosAcciones}>
              {mostrarEdicion && (
                <Pressable
                  onPress={() => manejarEditarGrupo(item)}
                  style={styles.iconoBoton}
                >
                  <Ionicons name="pencil" size={20} color="#2D9CDB" />
                </Pressable>
              )}
              {mostrarEliminacion && (
                <Pressable
                  onPress={() => manejarEliminarGrupo(item)}
                  style={styles.iconoBoton}
                >
                  <Ionicons name="close" size={20} color="#EB5757" />
                </Pressable>
              )}
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
          Grupos de Terapia
        </Text>
      </View>
      {residente?.nombre && residente?.apellido && (
        <Text style={styles.subtituloTexto}>
          {residente.nombre} {residente.apellido}
        </Text>
      )}

      {/* Lista principal */}
      <FlatList
        data={grupos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay grupos registrados</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal */}
      <Modal
        visible={mostrarModal}
        animationType="slide"
        transparent={true}
        onRequestClose={manejarCerrarModal}
      >
        <TouchableWithoutFeedback onPress={manejarCerrarModal}>
          <View style={styles.contenedorModal}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.contenidoModal}>
                <Text style={styles.modalTitulo}>
                  {editando ? "Editar Grupo" : "Nuevo Grupo"}
                </Text>

                <Text style={styles.label}>Descripción:</Text>
                <TextInput
                  style={styles.input}
                  value={descripcion}
                  onChangeText={setDescripcion}
                />
                <Text style={styles.label}>Agregar residente:</Text>
                <Pressable
                  style={styles.selectorResidente}
                  onPress={() =>
                    setMostrarSelectorResidente(!mostrarSelectorResidente)
                  }
                >
                  <Text style={styles.textoSelector}>
                    Seleccionar residentes
                  </Text>
                </Pressable>

                {mostrarSelectorResidente && (
                  <FlatList
                    data={listaResidentes.filter(
                      (residenteLista) =>
                        !residentesSeleccionados.some(
                          (residenteSeleccionado) =>
                            residenteSeleccionado.id === residenteLista.id,
                        ),
                    )}
                    keyExtractor={(item) => item.id}
                    style={styles.listaResidentes}
                    renderItem={({ item }) => (
                      <Pressable style={styles.itemResidente}>
                        <Text style={styles.textoItemResidente}>
                          {item.apellido}, {item.nombre}
                        </Text>
                        <Pressable
                          onPress={() => {
                            setResidentesSeleccionados((prev) => [
                              ...prev,
                              item,
                            ]);
                          }}
                          style={({ pressed }) => ({
                            opacity: pressed ? 0.5 : 1,
                          })}
                        >
                          <Ionicons name="add" size={24} color="green" />
                        </Pressable>
                      </Pressable>
                    )}
                  />
                )}

                {residentesSeleccionados.length > 0 && (
                  <FlatList
                    data={residentesSeleccionados}
                    keyExtractor={(item) => item.id}
                    style={styles.residentesSeleccionadosContainer}
                    renderItem={({ item }) => (
                      <Pressable style={styles.residenteChip}>
                        <Text style={styles.chipText}>
                          {item.apellido}, {item.nombre}
                        </Text>
                        <Pressable
                          onPress={() =>
                            setResidentesSeleccionados((prev) =>
                              prev.filter((r) => r.id !== item.id),
                            )
                          }
                          style={({ pressed }) => ({
                            opacity: pressed ? 0.5 : 1,
                          })}
                        >
                          <Ionicons name="close" size={20} color="red" />
                        </Pressable>
                      </Pressable>
                    )}
                  />
                )}

                {/* Selector de fecha y hora */}
                <Text style={styles.label}>Fecha y hora:</Text>
                <View style={pickerStyles.dateTimeContainer}>
                  {/* Selector de fecha para iOS */}
                  {Platform.OS === "ios" && (
                    <View style={pickerStyles.dateTimeButton}>
                      <DateTimePicker
                        value={fechaGrupo}
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
                        <Text>{fechaGrupo.toLocaleDateString("es-ES")}</Text>
                      </Pressable>

                      {mostrarPicker && (
                        <DateTimePicker
                          value={fechaGrupo}
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
                        value={fechaGrupo}
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
                          {fechaGrupo.toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </Pressable>

                      {mostrarTimePicker && (
                        <DateTimePicker
                          value={fechaGrupo}
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
                    style={[styles.botonModal, styles.botonGuardar]}
                    onPress={() =>
                      Alert.alert(
                        "Confirmar",
                        editando
                          ? "¿Estás seguro de actualizar este grupo?"
                          : "¿Estás seguro de crear este grupo?",
                        [
                          { text: "Cancelar", style: "cancel" },
                          {
                            text: editando ? "Actualizar" : "Crear",
                            onPress: manejarGuardadoGrupo,
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
              </View>
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

      {/* Selector de fecha para iOS */}
      {Platform.OS === "ios" && (
        <View style={[pickerStyles.pickerFlotante, pickerStyles.pickerGrupos]}>
          <DateTimePicker
            value={fechaFiltro}
            mode="date"
            onChange={manejarCambioFechaFiltro}
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
            <Text
              style={[
                pickerStyles.pickerGrupos,
                pickerStyles.pickerFlotanteAndroid,
                { right: 0, bottom: 80 },
              ]}
            >
              {fechaFiltro.toLocaleDateString("es-ES")}
            </Text>
          </Pressable>

          {mostrarPicker && (
            <DateTimePicker
              value={fechaFiltro}
              mode="date"
              onChange={manejarCambioFechaFiltro}
              locale="es-ES"
            />
          )}
        </View>
      )}
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
    paddingBottom: 80,
  },
  grupoItem: {
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
  grupoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  grupoFecha: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
  grupoDescripcion: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  grupoUsuario: {
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
  subtituloTexto: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 4,
  },
  grupoContenido: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  infoGrupo: {
    flex: 1,
    paddingRight: 10,
  },
  iconosAcciones: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
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
  textoSelector: {
    color: "#333",
  },
  textoItemResidente: {
    color: "#333",
  },
  selectorResidente: {
    maxHeight: 100,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 12,
    backgroundColor: "#F0F0F0",
  },
  listaResidentes: {
    maxHeight: 150,
    marginBottom: 15,
    borderRadius: 8,
  },
  itemResidente: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginBottom: 5,
    borderRadius: 8,
    backgroundColor: "#eaeaea",
  },
  residentesSeleccionadosContainer: {
    width: "100%",
    maxHeight: 100,
    marginBottom: 10,
  },
  residenteChip: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
    width: "100%",
  },
  chipText: {
    marginRight: 6,
    color: "#333",
  },
});

export default GruposScreen;
