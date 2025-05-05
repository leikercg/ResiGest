import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { auth } from "../../../fireBaseConfig";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import estilos from "../../../estilos/estilos";

const CambiarContrasena = ({ navigation }) => {
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [mostrarContrasenaActual, setMostrarContrasenaActual] = useState(false);
  const [mostrarnuevaContrasena, setMostrarNuevaContrasena] = useState(false);
  const [mostrarconfirmarContrasena, setMostrarConfirmarContrasena] =
    useState(false);

  // Función para mostrar alerta de confirmación
  const mostrarAlertaConfirmacion = () => {
    // Validaciones básicas primero
    if (!contrasenaActual || !nuevaContrasena || !confirmarContrasena) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (nuevaContrasena.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Mostrar alerta de confirmación
    Alert.alert(
      "Confirmar cambio de contraseña",
      "¿Estás seguro de que deseas cambiar tu contraseña?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => cambiarContrasena(), // Llamar a la función de cambio si confirman
        },
      ],
      { cancelable: false },
    );
  };

  // Función para cambiar la contraseña
  const cambiarContrasena = async () => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        contrasenaActual,
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, nuevaContrasena);

      Alert.alert("Éxito", "Contraseña actualizada correctamente", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);

      // Limpiar campos después de éxito
      setContrasenaActual("");
      setNuevaContrasena("");
      setConfirmarContrasena("");
    } catch (error) {
      let errorMessage = "Las contraseña es incorrecta";
      switch (error.code) {
        case "auth/wrong-password":
          errorMessage = "La contraseña actual es incorrecta";
          break;
        case "auth/weak-password":
          errorMessage = "La nueva contraseña es demasiado débil";
          break;
      }
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={estilos.estilosListaPersonasVentana.contenedor}>
      {/* Encabezado */}
      <View style={estilos.estilosListaPersonasVentana.titulo}>
        <Text style={estilos.estilosListaPersonasVentana.tituloTexto}>
          Cambiar Contraseña
        </Text>
      </View>

      {/* Formulario */}
      <View style={styles.contenedorFormulario}>
        {/* Campos del formulario */}
        <View style={styles.contenedorInput}>
          <Text style={styles.label}>Contraseña actual</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu contraseña actual"
              secureTextEntry={!mostrarContrasenaActual}
              value={contrasenaActual}
              onChangeText={setContrasenaActual}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() =>
                setMostrarContrasenaActual(!mostrarContrasenaActual)
              }
              style={styles.iconoOjo}
            >
              <Ionicons
                name={mostrarContrasenaActual ? "eye-off" : "eye"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contenedorInput}>
          <Text style={styles.label}>Nueva contraseña</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu nueva contraseña"
              secureTextEntry={!mostrarnuevaContrasena}
              value={nuevaContrasena}
              onChangeText={setNuevaContrasena}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setMostrarNuevaContrasena(!mostrarnuevaContrasena)}
              style={styles.iconoOjo}
            >
              <Ionicons
                name={mostrarnuevaContrasena ? "eye-off" : "eye"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contenedorInput}>
          <Text style={styles.label}>Confirmar nueva contraseña</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder="Confirma tu nueva contraseña"
              secureTextEntry={!mostrarconfirmarContrasena}
              value={confirmarContrasena}
              onChangeText={setConfirmarContrasena}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() =>
                setMostrarConfirmarContrasena(!mostrarconfirmarContrasena)
              }
              style={styles.iconoOjo}
            >
              <Ionicons
                name={mostrarconfirmarContrasena ? "eye-off" : "eye"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón de cambio - ahora llama a mostrarAlertaConfirmacion en lugar de cambiarContrasena directamente */}
        <TouchableOpacity
          style={styles.botonCambio}
          onPress={mostrarAlertaConfirmacion}
        >
          <Text style={styles.textoBotonCambio}>Cambiar Contraseña</Text>
        </TouchableOpacity>

        {/* Nota sobre requisitos */}
        <Text style={styles.textoNota}>
          La contraseña debe tener al menos 6 caracteres
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedorFormulario: {
    flex: 1,
    paddingTop: 30,
  },
  contenedorInput: {
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    fontWeight: "500",
  },
  passwordInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#FAFAFA",
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  iconoOjo: {
    padding: 10,
  },
  botonCambio: {
    backgroundColor: "#0000FF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  textoBotonCambio: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  textoNota: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontSize: 14,
  },
});

export default CambiarContrasena;
