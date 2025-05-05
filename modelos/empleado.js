import { doc, getDoc } from "firebase/firestore";
import { db } from "../fireBaseConfig";

class Empleado {
  constructor(id, email, nombre, apellido, departamentoId) {
    this.id = id;
    this.email = email;
    this.nombre = nombre;
    this.apellido = apellido;
    this.departamentoId = departamentoId;
  }

  // Relaciones con las demas entidades
  async obtenerNombreDepartamento() {
    try {
      const departamentoRef = doc(db, "departamentos", this.departamentoId);
      const departamentoSnap = await getDoc(departamentoRef);

      if (departamentoSnap.exists()) {
        return departamentoSnap.data().nombre;
      }
    } catch (error) {
      console.error("Error obteniendo departamento:", error);
    }
  }
}

export default Empleado;
