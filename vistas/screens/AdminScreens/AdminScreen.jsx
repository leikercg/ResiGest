import React from "react";
import { View, Text, Pressable } from "react-native";
import PersonasLista from "../../components/PersonasLista";
import estilos from "../../../estilos/estilos";
import { useTranslation } from "react-i18next";

const AdminScreen = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <View style={estilos.estilosListaPersonasVentana.contenedor}>
      <View style={estilos.estilosListaPersonasVentana.titulo}>
        <Text style={estilos.estilosListaPersonasVentana.tituloTexto}>
          {t("lista_residentes")}
        </Text>
      </View>
      <PersonasLista navigation={navigation} tipo={"residente"} />
      <Pressable
        style={({ pressed }) => [
          estilos.botonFLotante.botonFLotante,
          { opacity: pressed ? 0.6 : 1 },
        ]}
        onPress={() => navigation.navigate("FormResidente")}
      >
        <Text style={estilos.botonFLotante.buttonText}>+</Text>
      </Pressable>
    </View>
  );
};

export default AdminScreen;
