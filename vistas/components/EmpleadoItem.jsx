import React, { useContext, useState, useEffect } from "react";
import {
  Pressable,
  View,
  Text,
  Alert,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import estilos from "../../estilos/estilos";
import EmpleadoControlador from "../../controladores/empleadoControlador";
import TareaControlador from "../../controladores/tareaControlador";
import { AuthContext } from "../../contexto/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import residenteControlador from "../../controladores/residenteControlador";

const EmpleadoItem = ({ item, departamentos, fechaSeleccionada }) => {
  // Obtener el departamentoId del contexto de autenticación
  const { departamentoId } = useContext(AuthContext);
  // Para expansión y visualización de tareas
  const [expandido, setExpandido] = useState(false);
  const [tareas, setTareas] = useState([]);
  // Para la ventana modal
  const [mostrarModal, setMostrarModal] = useState(false);
  const [horaSeleccionada, setHoraSeleccionada] = useState(new Date());
  // Para mostrar la lisa de residentes
  const [residenteSeleccionadoId, setResidenteSeleccionadoId] = useState("");
  const [listaResidentes, setListaResidentes] = useState([]);
  // Para los campos de la modal
  const [descripcion, setDescripcion] = useState("");
  const [mostrarSelectorResidente, setMostrarSelectorResidente] =
    useState(false);
  // Para el modo edición
  const [editando, setEditando] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  // Cargar la lista de residentes al montar el componente
  useEffect(() => {
    const desuscribirse = residenteControlador.listarResidentes(
      (residentes) => {
        setListaResidentes(residentes || []);
      },
    );

    return () => {
      if (desuscribirse) desuscribirse();
    };
  }, []);

  // Cargar las tareas
  useEffect(() => {
    let unsubscribe;

    // Solo cargar tareas si es departamento 3 (ej. Enfermería), está expandido y hay fecha
    if (departamentoId === 3 && expandido && fechaSeleccionada) {
      unsubscribe = TareaControlador.obtenerTareasPorUsuarioYFecha(
        item.id,
        fechaSeleccionada,
        (tareasObtenidas) => {
          setTareas(tareasObtenidas);
        },
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [expandido, fechaSeleccionada]);

  // Verifica si la fecha seleccionada es hoy o una fecha futura
  const fechaEsModificable = () => {
    if (!fechaSeleccionada) return false;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Eliminar la hora
    const fecha = new Date(fechaSeleccionada);
    fecha.setHours(0, 0, 0, 0);

    return fecha >= hoy;
  };

  // Limpiar y cerrar el modal de tareas
  const manejarCerrarModal = () => {
    setEditando(false);
    setTareaSeleccionada(null);
    setDescripcion("");
    setHoraSeleccionada(new Date());
    setResidenteSeleccionadoId("");
    setMostrarSelectorResidente(false);
    setMostrarModal(false);
  };

  // Obtener el nombre del departamento basado en su ID
  const obtenerNombreDepartamento = (departamentoId) => {
    return departamentos[departamentoId] || "Desconocido";
  };

  // Eliminación de un empleado, sólo al ser admin
  const manejarEliminacion = () => {
    EmpleadoControlador.eliminarEmpleado(item.id, Alert.alert);
  };

  const manejarPresionado = () => {
    // Solo permitir expandir si es departamento 3
    if (departamentoId === 3) {
      setExpandido((prev) => !prev);
    }
  };

  // Confirmar y guardar una tarea
  const manejarGuardadoTarea = () => {
    // Validar campos obligatorios
    const residenteSeleccionado = listaResidentes.find(
      (r) => r.id === residenteSeleccionadoId,
    );

    if (!residenteSeleccionado || !horaSeleccionada || !descripcion.trim()) {
      Alert.alert("Error", "La descripción y residente son obligatorios.");
      return;
    }

    // Preparar la fecha final
    const fechaCura = new Date(fechaSeleccionada);
    fechaCura.setHours(horaSeleccionada.getHours());
    fechaCura.setMinutes(horaSeleccionada.getMinutes());
    fechaCura.setSeconds(0);
    fechaCura.setMilliseconds(0);

    // Validación mejorada de fecha/hora
    const ahora = new Date();
    if (fechaCura < ahora) {
      const esHoy = fechaCura.toDateString() === ahora.toDateString();

      if (!esHoy || (esHoy && fechaCura <= ahora)) {
        Alert.alert("Error", "Hora de visita inválida");
        return;
      }
    }

    const datosTarea = {
      fecha: fechaCura,
      descripcion: descripcion.trim(),
      usuarioId: item.id,
      usuarioNombre: `${item.nombre} ${item.apellido}`,
      residenteId: residenteSeleccionado.id,
      residenteNombre: `${residenteSeleccionado.nombre} ${residenteSeleccionado.apellido}`,
    };

    // Mostrar confirmación
    if (editando && tareaSeleccionada) {
      Alert.alert("Confirmar", "¿Deseas actualizar esta tarea?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Actualizar",
          onPress: async () => {
            await TareaControlador.actualizarTarea(
              tareaSeleccionada.id,
              datosTarea,
            );
            Alert.alert("Éxito", "Tarea actualizada correctamente");
            manejarCerrarModal();
          },
        },
      ]);
    } else {
      Alert.alert(
        "Confirmar",
        `¿Deseas asignar esta tarea a ${item.nombre} ${item.apellido}?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Crear",
            onPress: async () => {
              await TareaControlador.crearTarea(datosTarea);
              manejarCerrarModal();
            },
          },
        ],
      );
    }
  };

  return (
    <View style={styles.contenedorPrincipal}>
      <Pressable
        onPress={manejarPresionado}
        style={({ pressed }) => [
          estilos.personaItem.item,
          pressed && estilos.personaItem.pressedItem,
        ]}
      >
        <View style={styles.contenedorEmpleado}>
          <View>
            {/* Nombre */}
            <Text style={estilos.personaItem.nombre}>
              {item.apellido}, {item.nombre}
            </Text>

            {/* Mostrar detalles si se es admin */}
            {departamentoId !== 3 && (
              <View>
                <Text style={styles.textoDetalle}>
                  Departamento: {obtenerNombreDepartamento(item.departamentoId)}
                </Text>
                <Text style={styles.textoDetalle}>
                  Teléfono: {item.telefono}
                </Text>
              </View>
            )}
          </View>

          {/* Botón de eliminar, visible para departamento admin */}
          {departamentoId === 1 && (
            <Pressable
              onPress={manejarEliminacion}
              style={styles.botonEliminar}
            >
              <Ionicons name="close" size={20} color="#EB5757" />
            </Pressable>
          )}
        </View>
      </Pressable>

      {/* Sección expandible de tareas solo para departamento 3 */}
      {departamentoId === 3 && expandido && (
        <View style={styles.contenedorExpandido}>
          {/* Si no hay tareas */}
          {tareas.length === 0 ? (
            <Text style={styles.textoCentrado}>No hay tareas asignadas.</Text>
          ) : (
            /* Listado de tareas */
            tareas.map((tarea) => (
              <View key={tarea.id} style={styles.contenedorTarea}>
                <View style={styles.contenedorInfoTarea}>
                  <Text style={styles.textoTituloTarea}>
                    {tarea.descripcion}
                  </Text>
                  <Text style={styles.textoDetalleTarea}>
                    Residente: {tarea.residenteNombre}
                  </Text>
                  <Text style={styles.textoDetalleTarea}>
                    Hora:{" "}
                    {tarea.fecha.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </Text>
                </View>

                {/* Botones para cada tarea */}
                {fechaEsModificable() && (
                  <View style={styles.contenedorAccionesTarea}>
                    {/* Editar */}
                    <Pressable
                      style={styles.botonAccion}
                      onPress={() => {
                        setDescripcion(tarea.descripcion);
                        setHoraSeleccionada(new Date(tarea.fecha));
                        setResidenteSeleccionadoId(tarea.residenteId);
                        setTareaSeleccionada(tarea);
                        setEditando(true);
                        setMostrarModal(true);
                      }}
                    >
                      <Ionicons name="pencil" size={20} color="#2D9CDB" />
                    </Pressable>

                    {/* Eliminar */}
                    <Pressable
                      style={styles.botonAccion}
                      onPress={() => {
                        Alert.alert(
                          "Eliminar tarea",
                          "¿Estás seguro de que deseas eliminar esta tarea?",
                          [
                            { text: "Cancelar", style: "cancel" },
                            {
                              text: "Eliminar",
                              style: "destructive",
                              onPress: async () => {
                                await TareaControlador.eliminarTarea(tarea.id);
                              },
                            },
                          ],
                        );
                      }}
                    >
                      <Ionicons name="close" size={20} color="#EB5757" />
                    </Pressable>
                  </View>
                )}
              </View>
            ))
          )}

          {/* Agregar nueva tarea */}
          {fechaEsModificable() && (
            <Pressable
              style={styles.botonNuevo}
              onPress={() => {
                setEditando(false);
                setTareaSeleccionada(null);
                setMostrarModal(true);
              }}
            >
              <Text style={styles.textoBotonNuevo}>+ Nueva Tarea</Text>
            </Pressable>
          )}
        </View>
      )}

      <Modal
        visible={mostrarModal}
        animationType="slide"
        transparent={true}
        onRequestClose={manejarCerrarModal}
      >
        {/* Si se pulsa fuera se cierra */}
        <TouchableWithoutFeedback onPress={manejarCerrarModal}>
          <View style={styles.contenedorModal}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.contenidoModal}>
                <Text style={[styles.tituloModal, styles.textoCentrado]}>
                  {editando ? "Editar Tarea" : "Nueva Tarea"}
                </Text>

                {/* Descripción */}
                <Text style={styles.etiquetaModal}>Descripción:</Text>
                <TextInput
                  style={styles.campoTexto}
                  placeholder="Escribe una descripción..."
                  placeholderTextColor="#999"
                  value={descripcion}
                  onChangeText={setDescripcion}
                  multiline
                />

                {/* Selector de residente */}
                <Text style={styles.etiquetaModal}>Selecciona residente:</Text>
                <Pressable
                  style={styles.selectorResidente}
                  onPress={() =>
                    setMostrarSelectorResidente(!mostrarSelectorResidente)
                  }
                >
                  <Text style={styles.textoSelector}>
                    {residenteSeleccionadoId
                      ? listaResidentes.find(
                          (r) => r.id === residenteSeleccionadoId,
                        )?.apellido +
                        ", " +
                        listaResidentes.find(
                          (r) => r.id === residenteSeleccionadoId,
                        )?.nombre
                      : "Selecciona un residente"}
                  </Text>
                </Pressable>

                {/* Lista de residentes */}
                {mostrarSelectorResidente && (
                  <FlatList
                    data={listaResidentes}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.listaResidentes}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => {
                          setResidenteSeleccionadoId(item.id);
                          setMostrarSelectorResidente(false);
                        }}
                        style={styles.itemResidente}
                      >
                        <Text style={styles.textoItemResidente}>
                          {item.apellido}, {item.nombre}
                        </Text>
                      </Pressable>
                    )}
                  />
                )}

                {/* Picker de la hora */}
                <Text style={styles.etiquetaModal}>Selecciona hora:</Text>
                <DateTimePicker
                  value={horaSeleccionada}
                  mode="time"
                  is24Hour={true}
                  onChange={(event, date) => {
                    if (date) setHoraSeleccionada(date);
                  }}
                />

                {/* Botones modal */}
                <View style={styles.contenedorBotonesModal}>
                  <Pressable
                    style={[styles.botonModal, styles.botonCancelar]}
                    onPress={manejarCerrarModal}
                  >
                    <Text style={styles.textoBotonModal}>Cancelar</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.botonModal, styles.botonGuardar]}
                    onPress={manejarGuardadoTarea}
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
    </View>
  );
};

const styles = StyleSheet.create({
  contenedorPrincipal: {
    marginBottom: 10,
  },
  contenedorEmpleado: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  contenedorExpandido: {
    width: "95%",
    alignSelf: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 10,
  },
  contenedorTarea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  contenedorInfoTarea: {
    flex: 1,
  },
  contenedorAccionesTarea: {
    flexDirection: "row",
  },
  contenedorModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  contenidoModal: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  contenedorBotonesModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  textoDetalle: {
    color: "#666",
    fontSize: 14,
  },
  textoTituloTarea: {
    color: "#333",
    fontWeight: "bold",
    marginBottom: 4,
  },
  textoDetalleTarea: {
    color: "#666",
    fontSize: 14,
  },
  tituloModal: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  etiquetaModal: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#444",
  },
  textoSelector: {
    color: "#333",
  },
  textoItemResidente: {
    color: "#333",
  },
  textoBotonModal: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  textoBotonNuevo: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  // Botones
  botonEliminar: {
    padding: 5,
  },
  botonAccion: {
    marginLeft: 10,
    padding: 5,
  },
  botonNuevo: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
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

  // Selectores y campos
  selectorResidente: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
  },
  listaResidentes: {
    maxHeight: 150,
    marginBottom: 15,
    borderRadius: 8,
  },
  itemResidente: {
    padding: 12,
    marginBottom: 5,
    borderRadius: 8,
    backgroundColor: "#eaeaea",
  },
  campoTexto: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: "#000",
    backgroundColor: "#fff",
  },
});

export default EmpleadoItem;
