import React from "react";
import estilos from "../../../estilos/estilos";
import PersonasLista from "../../components/PersonasLista";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";

const AsistencialScreen = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <View style={estilos.estilosListaPersonasVentana.contenedor}>
      <View style={estilos.estilosListaPersonasVentana.titulo}>
        <Text style={estilos.estilosListaPersonasVentana.tituloTexto}>
          {t("lista_residentes")}
        </Text>
      </View>
      {/* Componente personalizado, en base al tipo */}
      <PersonasLista navigation={navigation} tipo={"residente"} />
    </View>
  );
};

export default AsistencialScreen;
