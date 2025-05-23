import React, { useState } from "react";
import {
  View,
  Image,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../fireBaseConfig";
import { Ionicons } from "@expo/vector-icons";
import estilos from "../../estilos/estilos";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mostrarContrasena, setVerContrasena] = useState(false);
  const [olvidoContrasena, setOlvidoContrasena] = useState(false);

  // Iniciar sesión
  const iniciarSesion = async () => {
    if (!email || !password) {
      setMensaje("Por favor ingresa un correo y una contraseña.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // Si llega aquí, el login fue exitoso
    } catch (error) {
      let mensajeError = "";

      switch (error.code) {
        case "auth/invalid-email":
          mensajeError = "El formato del correo es inválido";
          break;
        case "auth/too-many-requests":
          mensajeError = "Demasiados intentos. Cuenta temporalmente bloqueada";
          break;
        default:
          mensajeError = "Contraseña incorrecta o usuario no válido";
      }

      setMensaje(mensajeError);
    }
  };

  // Función para recuperar contraseña
  const restaurarContrasena = async () => {
    if (!email) {
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMensaje("Se ha enviado un correo para restablecer contraseña.");
      setOlvidoContrasena(false);
    } catch (error) {
      let mensajeError = "";

      switch (error.code) {
        case "auth/invalid-email":
          mensajeError = "El formato del correo es inválido.";
          break;
        case "auth/user-not-found":
          mensajeError = "No hay ningún usuario registrado con ese correo.";
          break;
        default:
          mensajeError = "Ocurrió un error al intentar enviar el correo.";
      }

      setMensaje(mensajeError);
    }
  };

  return (
    <View style={estilos.estilosLogin.contenedor}>
      <Image
        source={require("../../assets/logo.png")}
        style={{
          top: 80,
          height: 300,
          width: 300,
          resizeMode: "contain",
          alignSelf: "center",
          marginBottom: 20,
          position: "absolute",
        }}
      />

      <TextInput
        style={estilos.estilosLogin.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      {/* Solo mostrar contraseña si no estamos en la vista de olvido contraseña */}
      {!olvidoContrasena && (
        <View style={styles.contenedorContrsena}>
          <TextInput
            style={[estilos.estilosLogin.input, styles.inputContrasena]}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            value={password}
            secureTextEntry={!mostrarContrasena}
            onChangeText={setPassword}
            autoComplete="password"
          />
          {/* Botón para mostrar contraseña */}
          <Pressable
            style={styles.iconoOjo}
            onPress={() => setVerContrasena(!mostrarContrasena)}
          >
            <Ionicons
              name={mostrarContrasena ? "eye-off" : "eye"}
              size={20}
              color="#999"
            />
          </Pressable>
        </View>
      )}

      {/* Enlace para recuperar contraseña */}
      <Pressable
        onPress={() => setOlvidoContrasena(true)}
        style={styles.olvidarContrasena}
      >
        <Text style={styles.textoOlvidarContrasena}>
          ¿Olvidaste tu contraseña?
        </Text>
      </Pressable>

      {/* Mostrar mensajes de error/éxito */}
      {mensaje ? (
        <Text style={estilos.estilosLogin.error}>{mensaje}</Text>
      ) : null}

      {/* Mostrar botón de restaurar contraseña en vez de iniciar sesión si estamos en la vista de olvido de contraseña */}
      {olvidoContrasena ? (
        <View>
          <Pressable
            style={estilos.estilosLogin.button}
            onPress={restaurarContrasena}
          >
            <Text style={estilos.estilosLogin.buttonText}>Restuarar</Text>
          </Pressable>

          {/* Botón para cancelar y volver al login */}
          <Pressable
            onPress={() => {
              setOlvidoContrasena(false);
              setMensaje("");
            }}
            style={styles.botonCancelar}
          >
            <Text style={styles.textoCancelar}>Cancelar</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={estilos.estilosLogin.button} onPress={iniciarSesion}>
          <Text style={estilos.estilosLogin.buttonText}>Iniciar sesión</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contenedorContrsena: {
    width: "100%",
    marginBottom: 20,
    position: "relative",
  },
  inputContrasena: {
    paddingRight: 40,
  },
  iconoOjo: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 1,
  },
  olvidarContrasena: {
    alignSelf: "center",
    marginBottom: 20,
  },
  textoOlvidarContrasena: {
    color: "#2F80ED",
    fontSize: 14,
  },
  botonCancelar: {
    marginTop: 10,
    alignSelf: "center",
  },

  textoCancelar: {
    color: "#999",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
