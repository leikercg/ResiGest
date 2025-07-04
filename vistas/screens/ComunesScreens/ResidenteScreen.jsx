import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexto/AuthContext";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import estilos from "../../../estilos/estilos";
import ResidenteControlador from "../../../controladores/residenteControlador";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const ResidenteScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { departamentoId } = useContext(AuthContext);
  const { residente: residenteInicial } = route.params;
  const [residente, setResidente] = useState(residenteInicial);
  const [cargando, setCargando] = useState(!residenteInicial);
  const [familiares, setFamiliares] = useState([]);

  useEffect(() => {
    if (!residenteInicial?.id) return;

    const desuscribirResidente = ResidenteControlador.escucharCambiosResidente(
      residenteInicial.id,
      async (residenteActualizado) => {
        setResidente(residenteActualizado);
        setCargando(false);

        const desuscribirseFamiliares = residenteActualizado.obtenerFamiliares(
          (familiares) => {
            setFamiliares(familiares || []);
          },
        );

        return () => {
          if (desuscribirseFamiliares) desuscribirseFamiliares();
        };
      },
    );

    return () => {
      desuscribirResidente();
    };
  }, [residenteInicial.id]);

  if (cargando) {
    return (
      <View style={styles.cargandocontenedor}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={estilos.estilosListaPersonasVentana.contenedor}>
      <View style={estilos.estilosListaPersonasVentana.titulo}>
        <Text style={estilos.estilosListaPersonasVentana.tituloTexto}>
          {t("tituloFichaResidente")}
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contenedorDatos}>
          <Text style={styles.texto}>
            {t("labelNombre")} {residente.nombre}
          </Text>
          <Text style={styles.texto}>
            {t("labelApellido")} {residente.apellido}
          </Text>
          <Text style={styles.texto}>
            {t("labelEdad")} {residente.calcularEdad()}
          </Text>
          <Text style={styles.texto}>
            {t("labelFechaIngreso")} {residente.devolverFechaIngreso()}
          </Text>
        </View>

        <View style={styles.separador} />

        <View style={styles.contenedorFamiliares}>
          <Text style={styles.tituloFamiliares}>{t("tituloFamiliares")}</Text>
          {familiares && familiares.length > 0 ? (
            familiares.map((familiar) => (
              <View key={familiar.id} style={styles.contenedorDatos}>
                <Text style={styles.texto}>
                  {familiar.nombre} {familiar.apellido}
                </Text>
                <Text style={styles.texto}>
                  {t("labelTelefono") || "Teléfono"}: {familiar.telefono}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.texto}>{t("mensajeSinFamiliares")}</Text>
          )}
        </View>

        <View style={styles.separador} />

        <View style={styles.contenedorSeguimientos}>
          <Text style={styles.tituloSeguimientos}>
            {t("tituloSeguimientos")}
          </Text>
          <View style={styles.contenedorBotones}>
            <Pressable
              style={({ pressed }) => [
                styles.boton,
                pressed && styles.botonPresionado,
              ]}
              onPress={() =>
                navigation.navigate("SeguimientoScreen", {
                  residente: residente,
                  departamentoId: 2,
                })
              }
            >
              <Text style={styles.textoBoton}>{t("botonMedicina")}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.boton,
                pressed && styles.botonPresionado,
              ]}
              onPress={() =>
                navigation.navigate("SeguimientoScreen", {
                  residente: residente,
                  departamentoId: 3,
                })
              }
            >
              <Text style={styles.textoBoton}>{t("botonEnfermeria")}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.boton,
                pressed && styles.botonPresionado,
              ]}
              onPress={() =>
                navigation.navigate("SeguimientoScreen", {
                  residente: residente,
                  departamentoId: 5,
                })
              }
            >
              <Text style={styles.textoBoton}>{t("botonFisioterapia")}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.boton,
                pressed && styles.botonPresionado,
              ]}
              onPress={() =>
                navigation.navigate("SeguimientoScreen", {
                  residente: residente,
                  departamentoId: 6,
                })
              }
            >
              <Text style={styles.textoBoton}>{t("botonTerapia")}</Text>
            </Pressable>

            <View style={styles.contenedorBotonAsistencial}>
              <Pressable
                style={({ pressed }) => [
                  styles.boton,
                  pressed && styles.botonPresionado,
                ]}
                onPress={() =>
                  navigation.navigate("SeguimientoScreen", {
                    residente: residente,
                    departamentoId: 7,
                  })
                }
              >
                <Text style={styles.textoBoton}>{t("botonAsistencial")}</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.contenedorBotonItinerario}>
            <Pressable
              style={({ pressed }) => [
                styles.BotonItinerario,
                pressed && styles.BotonItinerarioPresionado,
              ]}
              onPress={() =>
                navigation.navigate("ItinerarioResidenteScreen", {
                  residente: residente,
                })
              }
            >
              <Text style={styles.textoBotonItinerario}>
                {t("botonItinerarioResidente")}
              </Text>
            </Pressable>
          </View>

          {departamentoId === 2 && (
            <View style={styles.contenedorBotonItinerario}>
              <Pressable
                style={({ pressed }) => [
                  styles.BotonItinerario,
                  pressed && styles.BotonItinerarioPresionado,
                ]}
                onPress={() =>
                  navigation.navigate("Visitas", {
                    residente: residente,
                  })
                }
              >
                <Text style={styles.textoBotonItinerario}>
                  {t("botonVisitas")}
                </Text>
              </Pressable>
            </View>
          )}

          {departamentoId === 3 && (
            <View style={styles.contenedorBotonItinerario}>
              <Pressable
                style={({ pressed }) => [
                  styles.BotonItinerario,
                  pressed && styles.BotonItinerarioPresionado,
                ]}
                onPress={() =>
                  navigation.navigate("CurasScreen", {
                    residente: residente,
                  })
                }
              >
                <Text style={styles.textoBotonItinerario}>
                  {t("botonCuras")}
                </Text>
              </Pressable>
            </View>
          )}

          {departamentoId === 5 && (
            <View style={styles.contenedorBotonItinerario}>
              <Pressable
                style={({ pressed }) => [
                  styles.BotonItinerario,
                  pressed && styles.BotonItinerarioPresionado,
                ]}
                onPress={() =>
                  navigation.navigate("SesionesScreen", {
                    residente: residente,
                  })
                }
              >
                <Text style={styles.textoBotonItinerario}>
                  {t("botonSesionesFisioterapia")}
                </Text>
              </Pressable>
            </View>
          )}

          {departamentoId === 6 && (
            <View style={styles.contenedorBotonItinerario}>
              <Pressable
                style={({ pressed }) => [
                  styles.BotonItinerario,
                  pressed && styles.BotonItinerarioPresionado,
                ]}
                onPress={() =>
                  navigation.navigate("GruposScreen", {
                    residente: residente,
                  })
                }
              >
                <Text style={styles.textoBotonItinerario}>
                  {t("botonGruposTerapia")}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      {departamentoId === 1 && (
        <TouchableOpacity
          style={estilos.botonFLotante.botonFLotante}
          onPress={() =>
            navigation.navigate("FormResidente", { residente: residente })
          }
        >
          <Ionicons name="pencil" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contenedorFamiliares: {
    backgroundColor: "#FFF",
  },
  contenedorSeguimientos: {
    backgroundColor: "#FFF",
  },
  tituloFamiliares: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  tituloSeguimientos: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  cargandocontenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  tituloTexto: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  contenedorDatos: {
    backgroundColor: "#F9F9F9",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  familiarItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#E9E9E9",
    borderRadius: 5,
  },
  contenedorBotones: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  contenedorBotonAsistencial: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  boton: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 10,
    width: "48%", // Dos botones por fila
    alignItems: "center",
    marginBottom: 10,
  },
  botonPresionado: {
    backgroundColor: "rgba(0, 0, 255, 0.8)", // Cambia el color cuando está presionado
  },
  textoBoton: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  contenedorBotonItinerario: {
    marginTop: 10, // Espacio entre los botones y el botón único
  },
  BotonItinerario: {
    backgroundColor: "#00000F",
    padding: 15,
    borderRadius: 10,
    width: "100%", // Ocupa todo el ancho del contenedor
    alignItems: "center",
  },
  BotonItinerarioPresionado: {
    backgroundColor: "rgba(0, 0, 15, 0.8)", // Cambia el color cuando está presionado
  },
  textoBotonItinerario: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  texto: {
    fontSize: 18,
    marginBottom: 10,
  },
  separador: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 15,
  },
});

export default ResidenteScreen;
