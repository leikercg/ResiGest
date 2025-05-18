import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  contenedorCargando: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 20,
    minHeight: "100%",
  },
  estiloItem: {
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  estiloContenedor: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  estiloInfo: {
    flex: 1,
    paddingRight: 10,
  },
  estiloCabecera: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  curaFecha: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
  estiloResidente: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  textoInfo: {
    fontSize: 13,
    color: "#777",
    marginBottom: 3,
  },
  contenedorVacio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  textoVacio: {
    marginTop: 10,
    fontSize: 16,
    color: "#999",
  },
  pickerFlotante: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
export default styles;
