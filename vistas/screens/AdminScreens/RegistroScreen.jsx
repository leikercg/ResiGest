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

const RegistroScreen = ({ navigation, route }) => {
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
    { id: "0", nombre: "Seleccione un departamento" },
    { id: "2", nombre: "Medicina" },
    { id: "3", nombre: "Enfermería" },
    { id: "5", nombre: "Fisioterapia" },
    { id: "6", nombre: "Terapia" },
    { id: "7", nombre: "Asistencia" },
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
      Alert.alert("Éxito", "Usuario registrado correctamente.");
    } catch (error) {
      Alert.alert("Error", error.message);
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
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
    if (tipo === "empleado" && departamentoId === "0") {
      Alert.alert("Error", "Por favor seleccione un departamento.");
      return;
    }
    if (tipo === "familiar" && residenteId === "0") {
      Alert.alert("Error", "Por favor seleccione un residente.");
      return;
    }
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de que deseas registrar este usuario?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: guardarUsuario,
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {tipo === "empleado" ? "Registro de Empleado" : "Registro de Familiar"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={telefono}
        keyboardType="phone-pad"
        onChangeText={setTelefono}
      />

      {tipo === "empleado" ? (
        <View>
          <Text style={styles.label}>Departamento:</Text>
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
          <Text style={styles.label}>Residente:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={residenteId}
              onValueChange={(itemValue) => setResidenteId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Seleccione un residente" value="0" key="0" />
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
        <Text style={styles.guardarButtonText}>Registrar</Text>
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
