import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { auth, db } from "../../../fireBaseConfig";
import { Ionicons } from "@expo/vector-icons";
import estilos from "../../../estilos/estilos";
import { AuthContext } from "../../../contexto/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

const OpcionesScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { user, departamentoId } = useContext(AuthContext);
  const [datosUsuario, setdatosUsuario] = useState(null);
  const [nombreDepartamento, setNombreDepartamento] = useState("");

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      // Usar if exists para evitar errores al cerrar sesión
      if (user) {
        try {
          const userDocRef = doc(db, "usuarios", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setdatosUsuario(userDocSnap.data());
          }

          // Obtener nombre del departamento
          if (departamentoId) {
            let nombreDep = "";
            switch (departamentoId) {
              case 1:
                nombreDep = "Administración";
                break;
              case 2:
                nombreDep = "Medicina";
                break;
              case 3:
                nombreDep = "Enfermería";
                break;
              case 4:
                nombreDep = "Familiar";
                break;
              case 5:
                nombreDep = "Fisioterapia";
                break;
              case 6:
                nombreDep = "Terapia Ocupacional";
                break;
              case 7:
                nombreDep = "Asistencial";
                break;
            }
            setNombreDepartamento(nombreDep);
          }
        } catch (error) {
          console.error("Error cargando datos del usuario:", error);
        }
      }
    };

    cargarDatosUsuario();
  }, [user, departamentoId]);

  const mostrarAlertaCerrarSesion = () => {
    Alert.alert(
      "Confirmar cierre de sesión",
      "¿Estás seguro de que deseas cerrar tu sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          onPress: () => auth.signOut(),
          style: "destructive",
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={estilos.estilosListaPersonasVentana.contenedor}>
      {/* Título */}
      <View style={estilos.estilosListaPersonasVentana.titulo}>
        <Text style={estilos.estilosListaPersonasVentana.tituloTexto}>
          Opciones
        </Text>
      </View>

      {/* Información del usuario */}
      <View style={styles.contenedorInfoUsuario}>
        <View style={styles.avatar}>
          <Ionicons name="person-circle" size={60} color="#2F80ED" />
        </View>
        <View style={styles.detalleUser}>
          <Text style={styles.nombre}>
            {datosUsuario?.nombre} {datosUsuario?.apellido}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.departamento}>
            <Ionicons name="business" size={16} color="#4CAF50" />
            <Text style={styles.textoDepartamento}>
              {nombreDepartamento || "Departamento"}
            </Text>
          </View>
        </View>
      </View>

      {/* Opciones */}
      <View style={styles.contenedorOpciones}>
        {departamentoId !== 1 && (
          <View>
            {/* Separador */}
            <View style={styles.separator} />
            <TouchableOpacity
              style={[styles.botonOpciones, styles.botonEditarContacto]}
              onPress={() => navigation.navigate("EditarContacto")}
            >
              <Ionicons name="create" size={24} color="#FF9800" />
              <Text
                style={[styles.botonOpcionesTexto, styles.textoEditarContacto]}
              >
                Editar contacto
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        )}

        {/* Separador */}
        <View style={styles.separator} />

        {/* Cambiar Idioma */}
        <TouchableOpacity
          style={[styles.botonOpciones, styles.botonIdioma]}
          onPress={() =>
            i18n.changeLanguage(i18n.language === "es" ? "en" : "es")
          }
        >
          <Ionicons name="language" size={24} color="#2F80ED" />
          <Text style={styles.botonOpcionesTexto}>{t("changeLanguage")}</Text>
        </TouchableOpacity>

        {/* Separador */}
        <View style={styles.separator} />

        {/* Botón Cambiar Contraseña */}
        <TouchableOpacity
          style={[styles.botonOpciones, styles.botonContrasena]}
          onPress={() => navigation.navigate("CambiarContrasena")}
        >
          <Ionicons name="key" size={24} color="#4CAF50" />
          <Text style={[styles.botonOpcionesTexto, styles.contrasenaTexto]}>
            Cambiar contraseña
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Separador */}
        <View style={styles.separator} />

        {/* Botón Cerrar Sesión */}
        <TouchableOpacity
          style={[styles.botonOpciones, styles.botonCerrarSesion]}
          onPress={mostrarAlertaCerrarSesion}
        >
          <Ionicons name="log-out" size={24} color="#EB5757" />
          <Text style={[styles.botonOpcionesTexto, styles.cerrarSesionTexto]}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  contenedorInfoUsuario: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    marginRight: 15,
  },
  detalleUser: {
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  departamento: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  textoDepartamento: {
    fontSize: 12,
    color: "#4CAF50",
    marginLeft: 4,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 15,
    marginHorizontal: 15,
  },
  contenedorOpciones: {
    flex: 1,
    width: "100%",
  },
  botonOpciones: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#FAFAFA",
  },
  botonIdioma: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  botonContrasena: {
    borderWidth: 1,
    borderColor: "#D4EDDA",
    backgroundColor: "#D4EDDA",
  },
  botonCerrarSesion: {
    borderWidth: 1,
    borderColor: "#F8D7DA",
    backgroundColor: "#F8D7DA",
  },
  botonOpcionesTexto: {
    flex: 1,
    fontSize: 18,
    marginLeft: 15,
    color: "#333",
  },
  contrasenaTexto: {
    color: "#4CAF50",
  },
  cerrarSesionTexto: {
    color: "#EB5757",
  },
  botonEditarContacto: {
    borderWidth: 1,
    borderColor: "#FFF3E0",
    backgroundColor: "#FFF3E0",
  },
  textoEditarContacto: {
    color: "#FF9800",
  },
});

export default OpcionesScreen;
