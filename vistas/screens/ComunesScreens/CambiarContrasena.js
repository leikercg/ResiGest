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
import { useTranslation } from "react-i18next";

const CambiarContrasena = ({ navigation }) => {
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [mostrarContrasenaActual, setMostrarContrasenaActual] = useState(false);
  const [mostrarnuevaContrasena, setMostrarNuevaContrasena] = useState(false);
  const [mostrarconfirmarContrasena, setMostrarConfirmarContrasena] =
    useState(false);
  const { t } = useTranslation();

  const mostrarAlertaConfirmacion = () => {
    if (!contrasenaActual || !nuevaContrasena || !confirmarContrasena) {
      Alert.alert(t("alertaErrorTitulo"), t("errorCamposVacios"));
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      Alert.alert(t("alertaErrorTitulo"), t("errorContrasenasNoCoinciden"));
      return;
    }

    if (nuevaContrasena.length < 6) {
      Alert.alert(t("alertaErrorTitulo"), t("errorContrasenaCorta"));
      return;
    }

    Alert.alert(
      t("alertaConfirmacionContraseña"),
      t("alertaConfirmacionMensaje"),
      [
        {
          text: t("cancelar") || "Cancelar", // If you want to add "cancelar" key in translation file
          style: "cancel",
        },
        {
          text: t("confirmar") || "Confirmar", // Same for "confirmar"
          onPress: () => cambiarContrasena(),
        },
      ],
      { cancelable: false },
    );
  };

  const cambiarContrasena = async () => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        contrasenaActual,
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, nuevaContrasena);

      Alert.alert(t("alertaExitoTitulo"), t("alertaExitoMensaje"), [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);

      setContrasenaActual("");
      setNuevaContrasena("");
      setConfirmarContrasena("");
    } catch (error) {
      let errorMessage = t("errorContrasenaIncorrecta");
      switch (error.code) {
        case "auth/wrong-password":
          errorMessage = t("errorContrasenaIncorrecta");
          break;
        case "auth/weak-password":
          errorMessage = t("errorContrasenaDebil");
          break;
      }
      Alert.alert(t("alertaErrorTitulo"), errorMessage);
    }
  };

  return (
    <View style={estilos.estilosListaPersonasVentana.contenedor}>
      <View style={estilos.estilosListaPersonasVentana.titulo}>
        <Text style={estilos.estilosListaPersonasVentana.tituloTexto}>
          {t("cambiar_contraseña")}
        </Text>
      </View>

      <View style={styles.contenedorFormulario}>
        <View style={styles.contenedorInput}>
          <Text style={styles.label}>{t("contrasenaActual")}</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder={t("placeholderContrasenaActual")}
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
          <Text style={styles.label}>{t("nuevaContrasena")}</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder={t("placeholderNuevaContrasena")}
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
          <Text style={styles.label}>{t("confirmarNuevaContrasena")}</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder={t("placeholderConfirmarNuevaContrasena")}
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

        <TouchableOpacity
          style={styles.botonCambio}
          onPress={mostrarAlertaConfirmacion}
        >
          <Text style={styles.textoBotonCambio}>
            {t("botonCambiarContrasena")}
          </Text>
        </TouchableOpacity>

        <Text style={styles.textoNota}>{t("notaContrasena")}</Text>
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
