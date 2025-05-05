import { db } from "../fireBaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

class DepartamentoControlador {
  // Método para obtener los departamentos en tiempo real
  static listarDepartamentos(callback) {
    try {
      const departamentosRef = collection(db, "departamentos");
      const desuscribirse = onSnapshot(departamentosRef, (querySnapshot) => {
        const departamentosData = {};
        querySnapshot.forEach((documento) => {
          const data = documento.data();
          departamentosData[documento.id] = data.nombre; // Guardar el nombre del departamento y su id como clave
        });
        callback(departamentosData); // Llamar al callback con los datos
      });

      return desuscribirse; // Devolver la función para desuscribirse
    } catch (error) {
      console.error("Error al obtener los departamentos:", error);
      throw error; // Propagar el error
    }
  }
}

export default DepartamentoControlador;
