import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./../../estilos/AgendaStyles";

const GrupoItem = ({ item }) => {
  const fechaItem = item.fecha?.toDate
    ? item.fecha.toDate()
    : new Date(item.fecha);

  return (
    <View style={styles.estiloItem}>
      <View style={styles.estiloContenedor}>
        <View style={styles.estiloInfo}>
          <View style={styles.estiloCabecera}>
            <Ionicons name="time" size={20} color="#0000FF" />
            <Text style={styles.curaFecha}>
              {fechaItem.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </Text>
            <Text style={styles.estiloTipoAccion}>
              Sesión grupal de terapia ocupacional
            </Text>
          </View>
          <Text style={styles.textoInfo}>Descripción: {item.descripcion}</Text>
          {item.residentes && (
            <Text style={styles.textoInfo}>
              Participantes: {item.residentes.length}
            </Text>
          )}
          <Text style={styles.estiloInfoUsuario}>
            Realizado por: {item.usuarioNombre}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default GrupoItem;
