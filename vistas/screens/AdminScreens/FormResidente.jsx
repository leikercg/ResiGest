import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  FlatList,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ResidenteControlador from "../../../controladores/residenteControlador";
import { Picker } from "@react-native-picker/picker";
import familiarControlador from "../../../controladores/familiarControlador";
import { Ionicons } from "@expo/vector-icons";
import estilos from "../../../estilos/estilos";
import pickerStyles from "../../../estilos/pickerStyles";

// Importa el hook o función i18n
import { useTranslation } from "react-i18next";

const FormResidente = ({ navigation, route }) => {
  const { t } = useTranslation();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [familiares, setFamiliares] = useState([]);
  const [todosFamiliares, setTodosFamiliares] = useState([]);
  const [familiarSeleccionado, setFamiliarSeleccionado] = useState("");
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const { residente } = route.params || {};
  console.log("Residente:", residente);

  useEffect(() => {
    if (residente) {
      setNombre(residente.nombre);
      setApellido(residente.apellido);
      setFechaNacimiento(residente.fecha_nacimiento.toDate());
      setFamiliares(residente.familiares || []);
    }

    // Se escuchan todos los familiares en tiempo real, para mostrarlos en el picker
    const desuscribirseListaFamiliares = familiarControlador.listarFamiliares(
      (familiares) => {
        setTodosFamiliares(familiares);
      },
    );

    return () => desuscribirseListaFamiliares();
  }, [residente]);

  // Función del componente para agregar familiar a la lista del formulario
  const agregarFamiliar = () => {
    if (familiarSeleccionado && !familiares.includes(familiarSeleccionado)) {
      setFamiliares([...familiares, familiarSeleccionado]);
      setFamiliarSeleccionado("");
    }
  };

  // Función del componente que permite borrar un familiar (Lo elimina del array, que luego se setea al campo familiares relacionados)
  const eliminarFamiliar = (familiarId) => {
    setFamiliares(familiares.filter((id) => id !== familiarId));
  };

  const manejarCambioFecha = (event, fechaSeleccionada) => {
    if (Platform.OS === "android") {
      setMostrarPicker(false);
    }

    if (fechaSeleccionada) {
      const fechaMinima = new Date();
      fechaMinima.setFullYear(fechaMinima.getFullYear() - 18);

      if (fechaSeleccionada > fechaMinima) {
        Alert.alert(
          t("alert_fecha_invalida_titulo"),
          t("alert_fecha_invalida_mensaje"),
        );
        return; // <-- IMPORTANTE: no seguir si la fecha es inválida
      }

      setFechaNacimiento(fechaSeleccionada);
    }
  };

  const guardarResidente = () => {
    // Validar campos obligatorios
    if (!nombre.trim() || !apellido.trim()) {
      Alert.alert(
        t("alert_guardar_error_titulo"),
        t("alert_guardar_error_mensaje"),
      );
      return;
    }

    // Validar edad (mayores de 18 años)
    const fechaMinima = new Date();
    fechaMinima.setFullYear(fechaMinima.getFullYear() - 18);

    if (fechaNacimiento > fechaMinima) {
      Alert.alert(
        t("alert_fecha_invalida_titulo"),
        t("alert_fecha_invalida_mensaje"),
      );
      return;
    }

    // Crear objeto residente
    const nuevoResidente = {
      nombre:
        nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase().trim(),
      apellido:
        apellido.charAt(0).toUpperCase() +
        apellido.slice(1).toLowerCase().trim(),
      fecha_nacimiento: fechaNacimiento,
      fecha_ingreso: residente ? residente.fecha_ingreso : new Date(),
      familiares,
    };

    ResidenteControlador.guardarResidente(
      residente?.id,
      nuevoResidente,
      navigation,
      (titulo, mensaje, botones, opciones) => {
        Alert.alert(titulo, mensaje, botones, opciones);
      },
    );
  };

  const renderFamiliar = ({ item }) => {
    const familiar = todosFamiliares.find((f) => f.id === item);
    return (
      <View style={estilos.estilosformularioResidente.familiarItem}>
        <Text style={estilos.estilosformularioResidente.familiarText}>
          {familiar
            ? `${familiar.nombre} ${familiar.apellido}`
            : t("familiar_item_cargando")}
        </Text>
        <Pressable
          onPress={() => eliminarFamiliar(item)}
          style={estilos.estilosformularioResidente.botonEliminar}
        >
          <Ionicons name="trash-outline" size={20} color="red" />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={estilos.estilosformularioResidente.container}>
      <Text style={estilos.estilosformularioResidente.titulo}>
        {residente ? t("form_editar_residente") : t("form_nuevo_residente")}
      </Text>

      <TextInput
        style={[
          estilos.estilosformularioResidente.input,
          residente && estilos.estilosformularioResidente.inputDisabled,
        ]}
        placeholder={t("placeholder_nombre")}
        value={nombre}
        onChangeText={setNombre}
        editable={!residente}
      />

      <TextInput
        style={[
          estilos.estilosformularioResidente.input,
          residente && estilos.estilosformularioResidente.inputDisabled,
        ]}
        placeholder={t("placeholder_apellido")}
        value={apellido}
        onChangeText={setApellido}
        editable={!residente}
      />

      <View style={estilos.estilosformularioResidente.botonFecha}>
        <Text style={estilos.estilosformularioResidente.botonFechaText}>
          {t("label_fecha_nacimiento")}
        </Text>
        {/* Selector de fecha para iOS */}
        {Platform.OS === "ios" && (
          <View>
            <DateTimePicker
              value={fechaNacimiento}
              mode="date"
              onChange={manejarCambioFecha}
              locale="es-ES"
              style={{
                borderRadius: 10,
              }}
            />
          </View>
        )}
        {/* Selector de fecha para Android */}
        {Platform.OS === "android" && (
          <View>
            <Pressable onPress={() => setMostrarPicker(true)}>
              <Text style={pickerStyles.pickerFlotanteAndroid}>
                {fechaNacimiento.toLocaleDateString("es-ES")}
              </Text>
            </Pressable>

            {mostrarPicker && (
              <DateTimePicker
                value={fechaNacimiento}
                mode="date"
                onChange={manejarCambioFecha}
                locale="es-ES"
              />
            )}
          </View>
        )}
      </View>
      <Text style={estilos.estilosformularioResidente.subtitulo}>
        {t("label_familiares_relacionados")}
      </Text>
      <FlatList
        data={familiares}
        keyExtractor={(item) => item}
        renderItem={renderFamiliar}
        ListEmptyComponent={
          <Text style={estilos.estilosformularioResidente.textoVacio}>
            {t("texto_sin_familiares")}
          </Text>
        }
      />

      <Text style={estilos.estilosformularioResidente.label}>
        {t("label_agregar_familiar")}
      </Text>
      <View style={estilos.estilosformularioResidente.pickerContenedor}>
        <Picker
          selectedValue={familiarSeleccionado}
          onValueChange={(itemValue) => setFamiliarSeleccionado(itemValue)}
          style={estilos.estilosformularioResidente.picker}
        >
          <Picker.Item label={t("picker_seleccionar_familiar")} value="" />
          {todosFamiliares.map((familiar) => (
            <Picker.Item
              key={familiar.id}
              label={`${familiar.nombre} ${familiar.apellido}`}
              value={familiar.id}
            />
          ))}
        </Picker>
      </View>
      <Pressable
        style={estilos.estilosformularioResidente.botonAgregar}
        onPress={agregarFamiliar}
      >
        <Text style={estilos.estilosformularioResidente.textoBotonAgregar}>
          {t("boton_agregar_familiar")}
        </Text>
      </Pressable>

      <Pressable
        style={estilos.estilosformularioResidente.guardarBoton}
        onPress={guardarResidente}
      >
        <Text style={estilos.estilosformularioResidente.guardarBotonText}>
          {residente ? t("boton_actualizar") : t("boton_guardar")}
        </Text>
      </Pressable>
    </View>
  );
};

export default FormResidente;
