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
import { useTranslation } from "react-i18next";

const PersonasLista = ({ navigation, tipo, filtro, fechaSeleccionada }) => {
  const { t } = useTranslation();
  const { user, departamentoId } = useContext(AuthContext);
  const [data, setDatos] = useState([]); // Datos completos sin filtrar
  const [departamentos, setDepartamentos] = useState({});
  const [residentesRelacionados, setResidentesRelacionados] = useState({}); // Residentes vinculados a familiares
  const [busqueda, setBusqueda] = useState("");
  const [datosFiltrados, setDatosFiltrados] = useState([]); // Datos filtrados por búsqueda y/o departamento

  useEffect(() => {
    let resultados = data;
    if (tipo === "residente" && departamentoId === 4) {
      resultados = resultados.filter((residente) =>
        residente.familiares?.includes(user.uid),
      );
      console.log(t("residentes_relacionados"), resultados);
      console.log(tipo, departamentoId);
    }

    if (filtro && tipo === "empleado") {
      resultados = resultados.filter(
        (item) => item.departamentoId === filtro.departamento,
      );
    }

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

  useEffect(() => {
    let desuscribirse;
    let desuscribirseDepartamentos;
    let desuscribirseResidentesRelacionados = {};

    desuscribirseDepartamentos = DepartamentoControlador.listarDepartamentos(
      (departamentosData) => {
        setDepartamentos(departamentosData);
      },
    );

    switch (tipo) {
      case "residente":
        desuscribirse = ResidenteControlador.listarResidentes((residentes) => {
          setDatos(residentes);
        });
        break;
      case "empleado":
        desuscribirse = EmpleadoControlador.listarEmpleados((empleados) => {
          setDatos(empleados);
        });
        break;
      case "familiar":
        desuscribirse = FamiliarControlador.listarFamiliares((familiares) => {
          const docs = familiares.map((familiar) => ({
            id: familiar.id,
            nombre: familiar.nombre,
            apellido: familiar.apellido,
            departamentoId: familiar.departamentoId,
            telefono: familiar.telefono,
          }));
          setDatos(docs);

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

    return () => {
      if (desuscribirse) desuscribirse();
      if (desuscribirseDepartamentos) desuscribirseDepartamentos();
      Object.values(desuscribirseResidentesRelacionados).forEach((desuscribe) =>
        desuscribe(),
      );
    };
  }, [tipo]);

  const renderItem = ({ item }) => {
    switch (tipo) {
      case "residente":
        return <ResidenteItem residente={item} navigation={navigation} />;
      case "empleado":
        return (
          <EmpleadoItem
            item={item}
            departamentos={departamentos}
            fechaSeleccionada={fechaSeleccionada}
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
      <View style={styles.buscadorContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.iconoBuscar}
        />
        <TextInput
          style={styles.buscador}
          placeholder={t(`buscar_${tipo}`)}
          placeholderTextColor="#999"
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda !== "" && (
          <Pressable
            onPress={() => setBusqueda("")}
            style={styles.botonLimpiar}
          >
            <Ionicons name="close-circle" size={20} color="#999" />
          </Pressable>
        )}
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={datosFiltrados}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContenedor}
        ListEmptyComponent={
          <Text style={styles.textoVacio}>
            {busqueda ? t("no_resultados") : t("no_datos")}
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
    paddingBottom: 200,
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
