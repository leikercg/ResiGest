import React, { useState } from "react";
import { View, TextInput, Text, Pressable, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../fireBaseConfig";
import { Ionicons } from "@expo/vector-icons";
import estilos from "../../estilos/estilos";

const LoginScreen = () => {
  const [email, setEmail] = useState(""); // Email
  const [password, setPassword] = useState(""); // Contraseña
  const [mensaje, setMensaje] = useState(""); // Mensajes de error/éxito
  const [mostrarContrasena, setVerContrasena] = useState(false); // Mostrar/ocultar contraseña

  // Iniciar sesión
  const iniciarSesion = async () => {
    if (!email || !password) {
      setMensaje("Por favor ingresa un correo y una contraseña.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // Si llega aquí, el login fue exitoso
    } catch (error) {
      let mensajeError = "";

      switch (error.code) {
        case "auth/invalid-email":
          mensajeError = "El formato del correo es inválido";
          break;
        case "auth/too-many-requests":
          mensajeError = "Demasiados intentos. Cuenta temporalmente bloqueada";
          break;
        default:
          mensajeError = "Contraseña incorrecta o usuario no válido";
      }

      setMensaje(mensajeError);
    }
  };
  // Función para recuperar contraseña, TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
  const restaurarContrasena = () => {
    console.log("Botón recuperar contraseña pulsado");
  };

  return (
    <View style={estilos.estilosLogin.contenedor}>
      {/* Título */}
      <Text style={estilos.estilosLogin.title}>ResiGest</Text>

      {/* Email */}
      <TextInput
        style={estilos.estilosLogin.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address" // Al cambiar el texto se setea el estado
        autoCapitalize="none"
        autoComplete="email"
      />

      {/* Ccontraseña */}
      <View style={styles.contenedorContrsena}>
        <TextInput
          style={[estilos.estilosLogin.input, styles.inputContrasena]}
          placeholder="Contraseña"
          placeholderTextColor="#999"
          value={password}
          secureTextEntry={!mostrarContrasena} // Inicia como oculta, es decir, igual a false
          onChangeText={setPassword}
          autoComplete="password" // Permite auto completar la contraseña
        />
        {/* Botón para mostrar contraseña */}
        <Pressable
          style={styles.iconoOjo}
          onPress={() => setVerContrasena(!mostrarContrasena)}
        >
          <Ionicons
            name={mostrarContrasena ? "eye-off" : "eye"} // Si está en true muestra el ícono de ojo cerrado
            size={20}
            color="#999"
          />
        </Pressable>
      </View>

      {/* Enlace para recuperar contraseña */}
      <Pressable onPress={restaurarContrasena} style={styles.olvidarContrasena}>
        <Text style={styles.textoOlvidarContrasena}>
          ¿Olvidaste tu contraseña?
        </Text>
      </Pressable>

      {/* Mostrar mensajes de error/éxito */}
      {mensaje ? ( // Si hay un mensaje, lo mostramos
        <Text style={estilos.estilosLogin.error}>{mensaje}</Text>
      ) : null}

      {/* Botón principal de inicio de sesión */}
      <Pressable style={estilos.estilosLogin.button} onPress={iniciarSesion}>
        <Text style={estilos.estilosLogin.buttonText}>Iniciar sesión</Text>
      </Pressable>
    </View>
  );
};

// Estilos específicos de este componente (complementan los estilos compartidos)
const styles = StyleSheet.create({
  contenedorContrsena: {
    width: "100%",
    marginBottom: 20,
    position: "relative", // Para posicionar el ícono absolutamente dentro
  },
  inputContrasena: {
    paddingRight: 40, // Espacio para el ícono del ojo
  },
  iconoOjo: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 1,
  },
  olvidarContrasena: {
    alignSelf: "center",
    marginBottom: 20,
  },
  textoOlvidarContrasena: {
    color: "#2F80ED",
    fontSize: 14,
  },
});

export default LoginScreen;
