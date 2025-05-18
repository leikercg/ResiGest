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

const FormResidente = ({ navigation, route }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [familiares, setFamiliares] = useState([]);
  const [todosFamiliares, setTodosFamiliares] = useState([]);
  const [familiarSeleccionado, setFamiliarSeleccionado] = useState("");
  const [mostrarPicker, setMostrarPicker] = useState(false); // Control de visibilidad

  const { residente } = route.params || {}; // Si no está en parámetros se establece como objeto vacío, para que no salté error en caso de no existir

  useEffect(() => {
    // Se ejecuta cuando se monta el componente
    // Establece los estados con las propiedades del residente
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

  // Función que actualiza el estado de la fecha cada vez que cambia
  const onChangeFecha = (event, fechaSeleccionada) => {
    // Para Android, necesitamos ocultar el picker después de seleccionar
    if (Platform.OS === "android") {
      setMostrarPicker(false);
    }

    if (fechaSeleccionada) {
      // Calcula la fecha mínima permitida (18 años atrás desde hoy)
      const fechaMinima = new Date();
      fechaMinima.setFullYear(fechaMinima.getFullYear() - 18);

      if (fechaSeleccionada > fechaMinima) {
        Alert.alert(
          "Fecha inválida",
          "El residente debe ser mayor de edad (18 años o más)",
        );
      } else {
        setFechaNacimiento(fechaSeleccionada);
      }
    }
  };

  // Función del componente que guarda o actualiza
  const guardarResidente = () => {
    // Validar campos obligatorios
    if (!nombre.trim() || !apellido.trim()) {
      Alert.alert("Error", "Nombre y apellido son campos obligatorios");
      return;
    }

    // Crea un residente con los datos en mayúsculas
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

    // Se llama al método del modelo residente
    ResidenteControlador.guardarResidente(
      residente?.id, // En caso de no tener id (se está creando) se establece como undefined
      nuevoResidente,
      navigation,
      Alert.alert,
    );
  };

  // Función que renderiza la lista de familiares relacionados
  const renderFamiliar = ({ item }) => {
    // Buscamos los familiares que coincidan con el id del familiar de los relacionados con el residente
    const familiar = todosFamiliares.find((f) => f.id === item);
    return (
      <View style={estilos.estilosformularioResidente.familiarItem}>
        <Text style={estilos.estilosformularioResidente.familiarText}>
          {familiar ? `${familiar.nombre} ${familiar.apellido}` : "Cargando..."}
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
        {/* Si existe el residente muesta Editar, si es null, undefined o es un objeto vacío muestra Nuevo */}
        {residente ? "Editar Residente" : "Nuevo Residente"}
      </Text>

      <TextInput
        style={[
          estilos.estilosformularioResidente.input,
          residente && estilos.estilosformularioResidente.inputDisabled,
        ]}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        editable={!residente}
      />

      <TextInput
        style={[
          estilos.estilosformularioResidente.input,
          residente && estilos.estilosformularioResidente.inputDisabled,
        ]}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
        editable={!residente}
      />

      <View style={estilos.estilosformularioResidente.botonFecha}>
        <Text style={estilos.estilosformularioResidente.botonFechaText}>
          {/* Convierte la fecha a formato fecha local */}
          Fecha de Nacimiento:
        </Text>
        {/* Selector de fecha para iOS */}
        {Platform.OS === "ios" && (
          <View>
            <DateTimePicker
              value={fechaNacimiento}
              mode="date"
              onChange={onChangeFecha}
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
                onChange={onChangeFecha}
                locale="es-ES"
              />
            )}
          </View>
        )}
      </View>
      <Text style={estilos.estilosformularioResidente.subtitulo}>
        Familiares Relacionados:
      </Text>
      <FlatList
        data={familiares}
        keyExtractor={(item) => item}
        renderItem={renderFamiliar}
        // Que mostrar en caso de que la lista este vacía
        ListEmptyComponent={
          <Text style={estilos.estilosformularioResidente.textoVacio}>
            No hay familiares relacionados.
          </Text>
        }
      />

      <Text style={estilos.estilosformularioResidente.label}>
        Agregar Familiar:
      </Text>
      <View style={estilos.estilosformularioResidente.pickerContenedor}>
        <Picker
          selectedValue={familiarSeleccionado}
          onValueChange={(itemValue) => setFamiliarSeleccionado(itemValue)}
          style={estilos.estilosformularioResidente.picker}
        >
          <Picker.Item label="Seleccione un familiar" value="" />
          {todosFamiliares.map((familiar) => (
            <Picker.Item
              key={familiar.id}
              label={`${familiar.nombre} ${familiar.apellido}`}
              value={familiar.id}
            />
          ))}
        </Picker>
      </View>
      {/* Agrega el familiar al array de familiares */}
      <Pressable
        style={estilos.estilosformularioResidente.botonAgregar}
        onPress={agregarFamiliar}
      >
        <Text style={estilos.estilosformularioResidente.textoBotonAgregar}>
          Agregar Familiar
        </Text>
      </Pressable>

      <Pressable
        style={estilos.estilosformularioResidente.guardarBoton}
        onPress={guardarResidente}
      >
        <Text style={estilos.estilosformularioResidente.guardarBotonText}>
          {residente ? "Actualizar" : "Guardar"}
        </Text>
      </Pressable>
    </View>
  );
};

export default FormResidente;
