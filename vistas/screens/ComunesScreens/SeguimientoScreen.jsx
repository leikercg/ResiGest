import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import SeguimientoControlador from "../../../controladores/seguimientoControlador";
import estilos from "../../../estilos/estilos";
import { getAuth } from "firebase/auth";
import { AuthContext } from "../../../contexto/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const auth = getAuth();

const SeguimientoScreen = ({ route, navigation }) => {
  const residente = route.params.residente;
  const departamentoId = route.params.departamentoId;
  const [seguimiento, setSeguimiento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [nuevoDetalle, setNuevoDetalle] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const { departamentoId: usuarioDepartamentoId } = useContext(AuthContext);
  const mostrarBotonFlotante = usuarioDepartamentoId == departamentoId;
  const { t } = useTranslation();

  useEffect(() => {
    if (!residente) {
      setCargando(false);
      return;
    }

    const obtenerSeguimiento = async () => {
      try {
        const seguimientoEncontrado =
          await SeguimientoControlador.buscarSeguimiento(
            residente.id,
            departamentoId,
          );
        setSeguimiento(seguimientoEncontrado);
      } catch (error) {
        console.error("Error al obtener el seguimiento:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerSeguimiento();
  }, [residente, departamentoId]);
  const obtenerNombreDepartamento = (id) => {
    switch (id) {
      case 2:
        return t("departamentoMedicina");
      case 3:
        return t("departamentoEnfermeria");
      case 5:
        return t("departamentoFisioterapia");
      case 6:
        return t("departamentoTerapiaOcupacional");
      case 7:
        return t("departamentoAsistencial");
      default:
        return t("departamentoDesconocido");
    }
  };

  const formatearFechaHora = (fecha) => {
    if (!fecha) return "";

    const date = fecha.toDate ? fecha.toDate() : new Date(fecha);
    return (
      date.toLocaleDateString() +
      " - " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const manejarAgregarDetalle = async () => {
    if (!nuevoDetalle.trim()) {
      Alert.alert(t("alertErrorDetalleVacio"), t("alertErrorDetalleVacio"));
      return;
    }

    Alert.alert(
      t("alertConfirmarAgregar"),
      t("alertConfirmarAgregar"),
      [
        { text: t("botonCancelar"), style: "cancel" },
        {
          text: t("botonAgregar"),
          onPress: async () => {
            try {
              await SeguimientoControlador.agregarDetalleSeguimiento(
                residente.id,
                departamentoId,
                nuevoDetalle.trim(),
                auth.currentUser.uid,
              );

              setNuevoDetalle("");
              const actualizado =
                await SeguimientoControlador.buscarSeguimiento(
                  residente.id,
                  departamentoId,
                );
              setSeguimiento(actualizado);
              setMostrarModal(false);
            } catch (error) {
              console.error("Error al agregar el detalle:", error);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  if (cargando) {
    return (
      <View style={styles.contenedorCargando}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!seguimiento) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t("mensajeNoSeguimiento")}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Pressable style={styles.detalleItem}>
      <View style={styles.detalleContenido}>
        <View style={styles.infodetalle}>
          <View style={styles.detalleHeader}>
            <Ionicons name="calendar" size={20} color="#0000FF" />
            <Text style={styles.detalleFecha}>
              {formatearFechaHora(item.fecha)}
            </Text>
          </View>
          <Text style={styles.detalleMotivo}>{item.comentario}</Text>
          <Text style={styles.detalleUsuario}>
            {t("labelRegistradoPor")} {item.usuarioNombre}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={estilos.estilosListaPersonasVentana.contenedor}>
      {/* Cabecera */}
      <View style={estilos.estilosListaPersonasVentana.titulo}>
        <Text style={estilos.estilosListaPersonasVentana.tituloTexto}>
          {t("tituloSeguimiento")}
        </Text>
      </View>

      <Text style={styles.subtituloTexto}>
        {residente.nombre} {residente.apellido} -{" "}
        {obtenerNombreDepartamento(departamentoId)}
      </Text>

      {/* Lista principal */}
      <FlatList
        data={seguimiento.detalles || []}
        keyExtractor={(item, index) => index.toString()} // Daba error, por venir de un array no traia id, por lo que usamos el índice
        //keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t("mensajeSinDetalles")}</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal de agregar */}
      <Modal
        visible={mostrarModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMostrarModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMostrarModal(false)}>
          <View style={styles.contenedorModal}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.contenidoModal}
            >
              <Text style={styles.modalTitulo}>
                {t("nuevoSeguimientoTitulo")}
              </Text>

              <Text style={styles.label}>{t("labelDetalles")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("placeholderAgregarSeguimiento")}
                value={nuevoDetalle}
                onChangeText={setNuevoDetalle}
                multiline
              />

              <View style={styles.contenedorBotones}>
                <Pressable
                  style={[styles.botonModal, styles.botonCancelar]}
                  onPress={() => setMostrarModal(false)}
                >
                  <Text style={styles.textoBotonModal}>
                    {t("botonCancelar")}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.botonModal, styles.botonAgregar]}
                  onPress={manejarAgregarDetalle}
                >
                  <Text style={styles.textoBotonModal}>
                    {t("botonAgregar")}
                  </Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Botón flotante */}
      {mostrarBotonFlotante && (
        <Pressable
          style={({ pressed }) => [
            estilos.botonFLotante.botonFLotante,
            { opacity: pressed ? 0.6 : 1 },
          ]}
          onPress={() => setMostrarModal(true)}
        >
          <Text style={estilos.botonFLotante.buttonText}>+</Text>
        </Pressable>
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
  },
  detalleItem: {
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
  detalleContenido: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  infodetalle: {
    flex: 1,
    paddingRight: 10,
  },
  detalleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detalleFecha: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
  detalleMotivo: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  detalleUsuario: {
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
    marginBottom: 10,
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
    height: 100,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: "top",
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

export default SeguimientoScreen;
