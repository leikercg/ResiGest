import { StyleSheet } from "react-native";
// Estilos formulario residente
const estilosformularioResidente = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15, // RETOCAR ESTOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  botonFecha: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    flexDirection: "row",
    alignItems: "center",
  },
  botonFechaText: {
    fontSize: 16,
    color: "#333",
  },
  datePickerContenedor: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  guardarBoton: {
    height: 50,
    backgroundColor: "blue",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  guardarBotonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  familiarItem: {
    backgroundColor: "#e9e9e9",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  familiarText: {
    fontSize: 16,
    flex: 1,
  },
  botonEliminar: {
    marginLeft: 10,
  },
  textoVacio: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  botonAgregar: {
    height: 50,
    backgroundColor: "green",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  textoBotonAgregar: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pickerContenedor: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  picker: {
    width: "100%",
  },
});
// Estilos para pantalla de login
const estilosLogin = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "white", // Fondo blanco
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black", // Azul oscuro
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: "blue", // Azul
    borderWidth: 1,
    borderRadius: 10, // Bordes redondeados
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: "#F9F9F9", // Fondo gris claro
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "blue", // Azul fuerte
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white", // Texto blanco
    fontSize: 18,
    fontWeight: "bold",
  },
});

// Estilos de la lista de residentes
const estilosListaPersonasVentana = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  titulo: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  tituloTexto: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});

// Estilos del botón flotante
const botonFLotante = StyleSheet.create({
  botonFLotante: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: "blue",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Agrega sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 9,
  },
  buttonText: {
    fontSize: 30,
    color: "white",
  },
});

// Estilos de los items de la lista de residentes
const personaItem = StyleSheet.create({
  item: {
    width: "100%",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pressedItem: {
    backgroundColor: "#b0b4b6", // Color más oscuro cuando está presionado
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
  },
  edad: {
    fontSize: 14,
    color: "#555",
  },
});

export default {
  estilosListaPersonasVentana,
  botonFLotante,
  personaItem,
  estilosLogin,
  estilosformularioResidente,
};
