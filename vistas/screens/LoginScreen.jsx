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
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mostrarContrasena, setVerContrasena] = useState(false);
  const [olvidoContrasena, setOlvidoContrasena] = useState(false);
  const { t } = useTranslation();

  const cambiarIdioma = async () => {
    const nuevoIdioma = i18n.language === "es" ? "en" : "es";
    await i18n.changeLanguage(nuevoIdioma);
  };

  const iniciarSesion = async () => {
    if (!email || !password) {
      setMensaje(t("camposVacios"));
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
          mensajeError = t("correoInvalido");
          break;
        case "auth/too-many-requests":
          mensajeError = t("demasiadosIntentos");
          break;
        default:
          mensajeError = t("credencialesInvalidas");
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
      setMensaje(t("exitoRestablecerContrasena"));
      setOlvidoContrasena(false);
    } catch (error) {
      let mensajeError = "";

      switch (error.code) {
        case "auth/invalid-email":
          mensajeError = t("correoInvalido");
          break;
        case "auth/user-not-found":
          mensajeError = t("usuarioNoEncontrado");
          break;
        default:
          mensajeError = t("errorRestablecerContrasena");
      }

      setMensaje(mensajeError);
    }
  };

  return (
    <View style={estilos.estilosLogin.contenedor}>
      <Image
        source={require("../../assets/logo.png")}
        style={{
          top: 30,
          height: 250,
          width: 250,
          resizeMode: "contain",
          alignSelf: "center",
          position: "relative",
        }}
      />

      <TextInput
        style={estilos.estilosLogin.input}
        placeholder={t("correoElectronico")}
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      {!olvidoContrasena && (
        <View style={styles.contenedorContrsena}>
          <TextInput
            style={[estilos.estilosLogin.input, styles.inputContrasena]}
            placeholder={t("contrasena")}
            placeholderTextColor="#999"
            value={password}
            secureTextEntry={!mostrarContrasena}
            onChangeText={setPassword}
            autoComplete="password"
          />
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

      <Pressable
        onPress={() => setOlvidoContrasena(true)}
        style={styles.olvidarContrasena}
      >
        <Text style={styles.textoOlvidarContrasena}>
          {t("olvidasteContrasena")}{" "}
        </Text>
      </Pressable>

      {mensaje ? (
        <Text style={estilos.estilosLogin.error}>{mensaje}</Text>
      ) : null}

      {olvidoContrasena ? (
        <View>
          <Pressable
            style={estilos.estilosLogin.button}
            onPress={restaurarContrasena}
          >
            <Text style={estilos.estilosLogin.buttonText}>
              {t("restaurar")}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setOlvidoContrasena(false);
              setMensaje("");
            }}
            style={styles.botonCancelar}
          >
            <Text style={styles.textoCancelar}>{t("cancelar")}</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={estilos.estilosLogin.button} onPress={iniciarSesion}>
          <Text style={estilos.estilosLogin.buttonText}>
            {t("iniciarSesion")}
          </Text>
        </Pressable>
      )}
      <Pressable
        onPress={cambiarIdioma}
        style={{ marginTop: 20, alignSelf: "center" }}
      >
        <Text style={{ color: "#2F80ED" }}>
          {i18n.language === "es" ? t("cambiarAIngles") : t("cambiarAEspanol")}
        </Text>
      </Pressable>
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
