import React from "react";
import { View, Text, Button } from "react-native";

const CambiarIdioma = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Cambiar idioma si da tiempo
      </Text>
      <Button title="Volver a Admin" onPress={() => navigation.goBack()} />
      <Button
        title="Ir a Registro"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
};

export default CambiarIdioma;
