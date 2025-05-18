import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexto/AuthContext"; // Añadir este import
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

const ResidenteScreen = ({ route, navigation }) => {
  const { departamentoId } = useContext(AuthContext); // Id del departamento del usuario
  const { residente: residenteInicial } = route.params; // Recibimos el residente inicial desde los parámetros de navegación
  const [residente, setResidente] = useState(residenteInicial); // Estado para almacenar el residente
  const [loading, setCargando] = useState(!residenteInicial); // Estado para manejar la carga
  const [familiares, setFamiliares] = useState([]); // Estado para almacenar los familiares

  // Escuchar cambios en tiempo real del residente
  useEffect(() => {
    if (!residenteInicial?.id) return; // Si no hay ID, no hacemos nada

    // Escuchar cambios en el residente
    const desuscribirResidente = ResidenteControlador.escucharCambiosResidente(
      residenteInicial.id,
      async (residenteActualizado) => {
        setResidente(residenteActualizado); // Actualizar el estado con el residente actualizado
        setCargando(false); // Finalizar la carga

        // Obtener los familiares del residente actualizado en tiempo real
        const desuscribirseFamiliares = residenteActualizado.obtenerFamiliares(
          (familiares) => {
            setFamiliares(familiares || []); // Actualizar el estado con los familiares
          },
        );

        // Limpiar la suscripción de familiares cuando el componente se desmonta
        return () => {
          if (desuscribirseFamiliares) desuscribirseFamiliares();
        };
      },
    );

    // Limpiar la suscripción del residente cuando el componente se desmonta
    return () => {
      desuscribirResidente();
    };
  }, [residenteInicial.id]);
  // Si está cargando mostramos un ActivityIndicator
  if (loading) {
    return (
      <View style={styles.loadingcontenedor}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={estilos.estilosListaPersonasVentana.contenedor}>
      <View style={estilos.estilosListaPersonasVentana.titulo}>
        <Text style={estilos.estilosListaPersonasVentana.tituloTexto}>
          Ficha de Residente
        </Text>
      </View>
      {/* Usamos Scrollview en lugar de FlatList por que quiero que se carge todos los elementos a la vez */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={styles.contenedorDatos}>
            <Text style={styles.texto}>Nombre: {residente.nombre}</Text>
            <Text style={styles.texto}>Apellido: {residente.apellido}</Text>
            <Text style={styles.texto}>Edad: {residente.calcularEdad()}</Text>
            <Text style={styles.texto}>
              Fecha de ingreso: {residente.devolverFechaIngreso()}
            </Text>
          </View>
        </View>
        {/* Separador */}
        <View style={styles.separador} />

        <View style={styles.contenedorFamiliares}>
          <Text style={styles.tituloFamiliares}>Familiares</Text>
          {familiares && familiares.length > 0 ? (
            familiares.map((familiar) => (
              <View key={familiar.id} style={styles.contenedorDatos}>
                <Text style={styles.texto}>
                  {familiar.nombre} {familiar.apellido}
                </Text>
                <Text style={styles.texto}>Teléfono: {familiar.telefono}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.texto}>No hay familiares registrados.</Text>
          )}
        </View>

        {/* Separador */}
        <View style={styles.separador} />

        <View style={styles.contenedorSeguimientos}>
          <Text style={styles.tituloSeguimientos}>Seguimientos</Text>
          <View style={styles.contenedorBotones}>
            {/* Botón de medicina */}
            <Pressable
              style={({ pressed }) => [
                styles.boton,
                pressed && styles.botonPresionado,
              ]}
              onPress={() =>
                navigation.navigate("SeguimientoScreen", {
                  residente: residente, // Enviamos el residente
                  departamentoId: 2, // Enviamos el deparatamento
                })
              }
            >
              <Text style={styles.textoBoton}>Medicina</Text>
            </Pressable>

            {/* Botón de enfermería */}
            <Pressable
              style={({ pressed }) => [
                styles.boton,
                pressed && styles.botonPresionado,
              ]}
              onPress={() =>
                navigation.navigate("SeguimientoScreen", {
                  residente: residente, // Enviamos el residente
                  departamentoId: 3, // Enviamos el deparatamento
                })
              }
            >
              <Text style={styles.textoBoton}>Enfermería</Text>
            </Pressable>

            {/* Botón de fisioterapia */}
            <Pressable
              style={({ pressed }) => [
                styles.boton,
                pressed && styles.botonPresionado,
              ]}
              onPress={() =>
                navigation.navigate("SeguimientoScreen", {
                  residente: residente, // Enviamos el residente
                  departamentoId: 5, // Enviamos el deparatamento
                })
              }
            >
              <Text style={styles.textoBoton}>Fisioterápia</Text>
            </Pressable>

            {/* Botón terapia */}
            <Pressable
              style={({ pressed }) => [
                styles.boton,
                pressed && styles.botonPresionado,
              ]}
              onPress={() =>
                navigation.navigate("SeguimientoScreen", {
                  residente: residente, // Enviamos el residente
                  departamentoId: 6, // Enviamos el deparatamento
                })
              }
            >
              <Text style={styles.textoBoton}>Terapia</Text>
            </Pressable>

            {/* Botón de asistencial */}
            <View style={styles.contenedorBotonAsistencial}>
              <Pressable
                style={({ pressed }) => [
                  styles.boton,
                  pressed && styles.botonPresionado,
                ]}
                onPress={() =>
                  navigation.navigate("SeguimientoScreen", {
                    residente: residente, // Enviamos el residente
                    departamentoId: 7, // Enviamos el deparatamento
                  })
                }
              >
                <Text style={styles.textoBoton}>Asistencial</Text>
              </Pressable>
            </View>
          </View>

          {/* Botón del itinerario */}
          <View style={styles.contenedorBotonItinerario}>
            <Pressable
              style={({ pressed }) => [
                styles.BotonItinerario,
                pressed && styles.BotonItinerarioPresionado,
              ]}
              onPress={() =>
                navigation.navigate("ItinerarioResidenteScreen", {
                  residente: residente, // Enviamos el residente
                })
              }
            >
              <Text style={styles.textoBotonItinerario}>
                Itinerario residente
              </Text>
            </Pressable>
          </View>

          {/* Botón de visita medicina */}
          {departamentoId === 2 && (
            <View style={styles.contenedorBotonItinerario}>
              <Pressable
                style={({ pressed }) => [
                  styles.BotonItinerario,
                  pressed && styles.BotonItinerarioPresionado,
                ]}
                onPress={() =>
                  navigation.navigate("Visitas", {
                    residente: residente, // Enviamos el residente
                  })
                }
              >
                <Text style={styles.textoBotonItinerario}>Visitas</Text>
              </Pressable>
            </View>
          )}

          {/* Botón de cura en enfermería */}
          {departamentoId === 3 && (
            <View style={styles.contenedorBotonItinerario}>
              <Pressable
                style={({ pressed }) => [
                  styles.BotonItinerario,
                  pressed && styles.BotonItinerarioPresionado,
                ]}
                onPress={() =>
                  navigation.navigate("CurasScreen", {
                    residente: residente, // Enviamos el residente
                  })
                }
              >
                <Text style={styles.textoBotonItinerario}>Curas</Text>
              </Pressable>
            </View>
          )}

          {/* Botón de sesiones en fisioterapia */}
          {departamentoId === 5 && (
            <View style={styles.contenedorBotonItinerario}>
              <Pressable
                style={({ pressed }) => [
                  styles.BotonItinerario,
                  pressed && styles.BotonItinerarioPresionado,
                ]}
                onPress={() =>
                  navigation.navigate("SesionesScreen", {
                    residente: residente, // Enviamos el residente
                  })
                }
              >
                <Text style={styles.textoBotonItinerario}>
                  Sesiones de fisioterapia
                </Text>
              </Pressable>
            </View>
          )}

          {/* Botón de grupos en terapia */}
          {departamentoId === 6 && (
            <View style={styles.contenedorBotonItinerario}>
              <Pressable
                style={({ pressed }) => [
                  styles.BotonItinerario,
                  pressed && styles.BotonItinerarioPresionado,
                ]}
                onPress={() =>
                  navigation.navigate("GruposScreen", {
                    residente: residente, // Enviamos el residente
                  })
                }
              >
                <Text style={styles.textoBotonItinerario}>
                  Grupos de terapia
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botón flotante de edición sólo visble en la administración */}
      {departamentoId === 1 && (
        <TouchableOpacity
          style={estilos.botonFLotante.botonFLotante}
          onPress={
            () => navigation.navigate("FormResidente", { residente: residente }) // Navega a la pantalla de edición
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
    backgroundColor: "#fff",
  },
  contenedorSeguimientos: {
    backgroundColor: "#fff",
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
  loadingcontenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  tituloTexto: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  contenedorDatos: {
    backgroundColor: "#f9f9f9",
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
    backgroundColor: "#e9e9e9",
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
    color: "#fff",
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
    color: "#fff",
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
