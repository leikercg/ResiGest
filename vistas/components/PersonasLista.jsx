import React, { useEffect, useState, useContext } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
} from "react-native";
import ResidenteItem from "./ResidenteItem";
import EmpleadoItem from "./EmpleadoItem";
import FamiliarItem from "./FamiliarItem";
import ResidenteControlador from "../../controladores/residenteControlador";
import EmpleadoControlador from "../../controladores/empleadoControlador";
import DepartamentoControlador from "../../controladores/departamentoControlador";
import FamiliarControlador from "../../controladores/familiarControlador";
import { AuthContext } from "../../contexto/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const PersonasLista = ({ navigation, tipo, filtro, fechaSeleccionada }) => {
  // Estados del componente
  const { user, departamentoId } = useContext(AuthContext);
  const [data, setDatos] = useState([]); // Datos completos sin filtrar
  const [departamentos, setDepartamentos] = useState({}); // Mapa de departamentos
  const [residentesRelacionados, setResidentesRelacionados] = useState({}); // Residentes vinculados a familiares
  const [busqueda, setBusqueda] = useState("");
  const [datosFiltrados, setDatosFiltrados] = useState([]); // Datos filtrados por búsqueda y/o departamento

  // Efecto para filtrar datos cuando cambia la búsqueda, los datos originales o el filtro
  useEffect(() => {
    let resultados = data;
    // Filtro para familiares para mostrar solo residentes relacionados
    if (tipo === "residente" && departamentoId === 4) {
      resultados = resultados.filter((residente) =>
        residente.familiares?.includes(user.uid),
      );
      console.log("Residentes relacionados", resultados);
      console.log(tipo, departamentoId);
    }

    // Aplicar filtro por departamento si está definido y es del tipo empleado
    if (filtro && tipo === "empleado") {
      resultados = resultados.filter(
        (item) => item.departamentoId === filtro.departamento,
      );
    }

    // Aplicar filtro por búsqueda de texto
    if (busqueda) {
      const textoBusqueda = busqueda.toLowerCase();
      resultados = resultados.filter((item) => {
        return (
          item.nombre.toLowerCase().includes(textoBusqueda) ||
          item.apellido.toLowerCase().includes(textoBusqueda)
        );
      });
    }

    setDatosFiltrados(resultados);
  }, [busqueda, data, filtro, tipo, user]);

  // Efecto principal para cargar datos según el tipo
  useEffect(() => {
    let desuscribirse; // Para cancelar suscripción principal
    let desuscribirseDepartamentos; // Para cancelar suscripción a departamentos
    let desuscribirseResidentesRelacionados = {}; // Para cancelar múltiples suscripciones

    // Suscribirse a cambios en la lista de departamentos
    desuscribirseDepartamentos = DepartamentoControlador.listarDepartamentos(
      (departamentosData) => {
        setDepartamentos(departamentosData);
      },
    );

    // Configurar suscripciones según el tipo de lista
    switch (tipo) {
      case "residente":
        // Suscribirse a residentes
        desuscribirse = ResidenteControlador.listarResidentes((residentes) => {
          setDatos(residentes);
        });
        break;
      case "empleado":
        // Suscribirse a empleados
        desuscribirse = EmpleadoControlador.listarEmpleados((empleados) => {
          setDatos(empleados);
        });
        break;
      case "familiar":
        // Suscribirse a familiares y sus residentes relacionados
        desuscribirse = FamiliarControlador.listarFamiliares((familiares) => {
          // Mapear datos básicos de familiares
          const docs = familiares.map((familiar) => ({
            id: familiar.id,
            nombre: familiar.nombre,
            apellido: familiar.apellido,
            departamentoId: familiar.departamentoId,
            telefono: familiar.telefono,
          }));
          setDatos(docs);

          // Para cada familiar, escuchar cambios en sus residentes relacionados
          familiares.forEach((familiar) => {
            desuscribirseResidentesRelacionados[familiar.id] =
              FamiliarControlador.escucharResidentesRelacionados(
                familiar.id,
                (residentes) => {
                  setResidentesRelacionados((prev) => ({
                    ...prev,
                    [familiar.id]: residentes,
                  }));
                },
              );
          });
        });
        break;
    }

    // Función de limpieza al desmontar el componente o cambiar el tipo
    return () => {
      // Cancelar todas las suscripciones activas
      if (desuscribirse) desuscribirse();
      if (desuscribirseDepartamentos) desuscribirseDepartamentos();
      Object.values(desuscribirseResidentesRelacionados).forEach((desuscribe) =>
        desuscribe(),
      );
    };
  }, [tipo]); // Se ejecuta cuando cambia el tipo de lista

  // Función para renderizar cada ítem según el tipo
  const renderItem = ({ item }) => {
    switch (tipo) {
      case "residente":
        return <ResidenteItem residente={item} navigation={navigation} />;
      case "empleado":
        return (
          <EmpleadoItem
            item={item}
            departamentos={departamentos}
            fechaSeleccionada={fechaSeleccionada} // Con la fecha seleccionada
          />
        );

      case "familiar":
        return (
          <FamiliarItem
            item={item}
            residentesRelacionados={residentesRelacionados[item.id]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View>
      {/* Barra de búsqueda */}
      <View style={styles.buscadorContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.iconoBuscar}
        />
        <TextInput
          style={styles.buscador}
          placeholder={`Buscar ${tipo}...`}
          placeholderTextColor="#999"
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {/* Botón para limpiar búsqueda, solo visible cuando hay texto */}
        {busqueda !== "" && (
          <Pressable
            onPress={() => setBusqueda("")}
            style={styles.botonLimpiar}
          >
            <Ionicons name="close-circle" size={20} color="#999" />
          </Pressable>
        )}
      </View>

      {/* Lista de resultados */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={datosFiltrados}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContenedor}
        ListEmptyComponent={
          <Text style={styles.textoVacio}>
            {busqueda
              ? "No se encontraron resultados"
              : "No hay datos disponibles"}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buscadorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  buscador: {
    flex: 1,
    height: "100%",
    marginLeft: 10,
    fontSize: 16,
  },
  iconoBuscar: {
    marginRight: 10,
  },
  botonLimpiar: {
    padding: 5,
  },
  flatListContenedor: {
    paddingBottom: 20,
    minHeight: "100%",
  },

  textoVacio: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default PersonasLista;
