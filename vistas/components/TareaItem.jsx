import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./../../estilos/AgendaStyles";
import { useTranslation } from "react-i18next";

const TareaItem = ({ item }) => {
  const { t } = useTranslation();
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
              {t("tarea_asistencial")}
            </Text>
          </View>
          <Text style={styles.estiloResidente}>{item.residenteNombre}</Text>
          <Text style={styles.textoInfo}>
            {t("descripcion")} {item.descripcion}
          </Text>
          <Text style={styles.estiloInfoUsuario}>
            {t("realizado_por")}: {item.usuarioNombre}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TareaItem;
