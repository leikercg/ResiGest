import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../../fireBaseConfig";
import { useTranslation } from "react-i18next";

const EditarTelefonoScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [telefono, setTelefono] = useState("");
  const [telefonoOriginal, setTelefonoOriginal] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarTelefono = async () => {
      try {
        if (auth.currentUser) {
          const userDoc = await getDoc(
            doc(db, "usuarios", auth.currentUser.uid),
          );
          if (userDoc.exists()) {
            const tel = userDoc.data().telefono || "";
            setTelefono(tel);
            setTelefonoOriginal(tel);
          }
        }
      } catch (error) {
        console.error("Error cargando teléfono:", error);
        Alert.alert(
          t("alertaErrorTitulo"),
          t("error") + ": No se pudo cargar el teléfono actual",
        );
      } finally {
        setCargando(false);
      }
    };

    cargarTelefono();
  }, []);

  const mostrarAlertaConfirmacion = () => {
    if (telefono.trim() === telefonoOriginal.trim()) {
      Alert.alert(
        t("alertaAvisoTitulo"),
        "No has realizado ningún cambio en el teléfono",
      );
      return;
    }

    Alert.alert(
      t("alertaConfirmacionTitulo"),
      t("alertaConfirmacionActualizarTelefono"),
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: t("confirmar"),
          onPress: guardarTelefono,
        },
      ],
      { cancelable: true },
    );
  };

  const guardarTelefono = async () => {
    if (!telefono.trim()) {
      Alert.alert(t("alertaErrorTitulo"), "El teléfono no puede estar vacío");
      return;
    }

    try {
      await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {
        telefono: telefono.trim(),
      });
      Alert.alert(t("exito"), "Teléfono actualizado correctamente");
      navigation.goBack();
    } catch (error) {
      console.error("Error actualizando teléfono:", error);
      Alert.alert(t("alertaErrorTitulo"), "No se pudo guardar el teléfono");
    }
  };

  if (cargando) {
    return (
      <View style={styles.contenedorCargando}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{t("editarTelefonoTitulo")}</Text>

      <Text style={styles.label}>{t("labelNuevoTelefono")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("placeholderTelefono")}
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />

      <Pressable
        style={styles.botonGuardar}
        onPress={mostrarAlertaConfirmacion}
      >
        <Text style={styles.textoBotonGuardar}>
          {t("botonGuardarTelefono")}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  contenedorCargando: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  input: {
    height: 50,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
  },
  botonGuardar: {
    height: 50,
    backgroundColor: "#0000FF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  textoBotonGuardar: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "600",
  },
});

export default EditarTelefonoScreen;
