import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { registerUser } from "../../../services/authService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../fireBaseConfig";
import { useTranslation } from "react-i18next";

const RegistroScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [departamentoId, setDepartamentoId] = useState("0");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [residenteId, setResidenteId] = useState("0");
  const [residentes, setResidentes] = useState([]);
  const { tipo } = route.params;
  const departamentos = [
    { id: "0", nombre: t("picker_departamento_default") },
    { id: "2", nombre: t("depMedicina") },
    { id: "3", nombre: t("depEnfermeria") },
    { id: "5", nombre: t("depFisioterapia") },
    { id: "6", nombre: t("depTerapiaOcupacional") },
    { id: "7", nombre: t("depAsistencial") },
  ];
  useEffect(() => {
    const cargarResidentes = async () => {
      const residentesRef = collection(db, "residentes");
      const querySnapshot = await getDocs(residentesRef);
      const residentesData = querySnapshot.docs.map((doc) => ({
        // Mapeamos cada registro y lo convertimos a un objeto
        id: doc.id, // ID del documento, ya que no se obtiene automáticamente
        ...doc.data(), // Datos del residente
      }));
      setResidentes(residentesData);
    };

    if (tipo === "familiar") {
      cargarResidentes();
    }
  }, [tipo]);

  const guardarUsuario = async () => {
    try {
      // Si es un familiar, usar el ID del residente seleccionado
      const idResidente = tipo === "familiar" ? residenteId : null;
      await registerUser(
        email,
        password,
        nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase().trim(),
        apellido.charAt(0).toUpperCase() +
          apellido.slice(1).toLowerCase().trim(),
        telefono.trim(),
        tipo === "familiar" ? 4 : Number(departamentoId), // Si es familiar, departamentoId = 4
        idResidente, // Pasar el ID del residente seleccionado
      );
      navigation.goBack();
      Alert.alert(t("exito"), t("alert_exito_mensaje"));
    } catch (error) {
      Alert.alert(t("error"), error.message);
    }
  };

  const confirmarGuardado = () => {
    if (
      !nombre.trim() ||
      !apellido.trim() ||
      !email.trim() ||
      !password.trim() ||
      !telefono.trim()
    ) {
      Alert.alert(t("error"), t("alert_error_campos_obligatorios"));
      return;
    }
    if (tipo === "empleado" && departamentoId === "0") {
      Alert.alert(t("error"), t("alert_error_departamento"));
      return;
    }
    if (tipo === "familiar" && residenteId === "0") {
      Alert.alert(t("error"), t("alert_error_residente"));
      return;
    }
    Alert.alert(
      t("alert_confirmar_titulo"),
      t("alert_confirmar_mensaje"),
      [
        {
          text: t("alert_confirmar_cancelar"),
          style: "cancel",
        },
        {
          text: t("alert_confirmar_confirmar"),
          onPress: guardarUsuario,
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {tipo === "empleado"
          ? t("registro_empleado_titulo")
          : t("registro_familiar_titulo")}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={t("placeholder_email")}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder={t("placeholder_password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder={t("placeholder_nombre")}
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder={t("placeholder_apellido")}
        value={apellido}
        onChangeText={setApellido}
      />

      <TextInput
        style={styles.input}
        placeholder={t("placeholder_telefono")}
        value={telefono}
        keyboardType="phone-pad"
        onChangeText={setTelefono}
      />

      {tipo === "empleado" ? (
        <View>
          <Text style={styles.label}>{t("label_departamento")}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={departamentoId}
              onValueChange={(itemValue) => setDepartamentoId(itemValue)}
              style={styles.picker}
            >
              {departamentos.map((depto) => (
                <Picker.Item
                  key={depto.id}
                  label={depto.nombre}
                  value={depto.id}
                />
              ))}
            </Picker>
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.label}>{t("label_residente")}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={residenteId}
              onValueChange={(itemValue) => setResidenteId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item
                label={t("picker_residente_default")}
                value="0"
                key="0"
              />
              {residentes.map((residente) => (
                <Picker.Item
                  key={residente.id}
                  label={`${residente.nombre} ${residente.apellido}`}
                  value={residente.id}
                />
              ))}
            </Picker>
          </View>
        </View>
      )}

      <Pressable style={styles.guardarButton} onPress={confirmarGuardado}>
        <Text style={styles.guardarButtonText}>{t("boton_registrar")}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  picker: {
    width: "100%",
  },
  guardarButton: {
    height: 50,
    backgroundColor: "blue",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  guardarButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default RegistroScreen;
