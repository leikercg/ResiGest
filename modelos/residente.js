import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../fireBaseConfig";

class Residente {
  constructor(
    id,
    nombre,
    apellido,
    fecha_nacimiento,
    fecha_ingreso,
    familiares,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.fecha_nacimiento = fecha_nacimiento;
    this.fecha_ingreso = fecha_ingreso;
    this.familiares = familiares; // Array de IDs de familiares
  }

  // Método para calcular la edad
  calcularEdad() {
    if (!this.fecha_nacimiento || !this.fecha_nacimiento.seconds) {
      return "Desconocida";
    }

    const nacimiento = new Date(this.fecha_nacimiento.seconds * 1000);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  }

  // Método para devolver la fecha de ingreso
  devolverFechaIngreso() {
    // Verificar si la fecha de ingreso está definida
    if (!this.fecha_ingreso || !this.fecha_ingreso.seconds) {
      return "Fecha de ingreso desconocida";
    }

    // Convertir el timestamp de Firestore a un objeto Date
    const fechaIngreso = new Date(this.fecha_ingreso.seconds * 1000);

    // Obtener el día, mes y año
    const dia = String(fechaIngreso.getDate()).padStart(2, "0"); // Asegura 2 dígitos
    const mes = String(fechaIngreso.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
    const anio = fechaIngreso.getFullYear();

    // Devolver la fecha en formato dd/mm/yyyy
    return `${dia}/${mes}/${anio}`;
  }

  // Reciones con otras coleccionesssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss

  // Método para obtener los familiares desde Firestore
  obtenerFamiliares(callback) {
    try {
      // Si no hay IDs de familiares, retornar un array vacío
      if (!this.familiares || this.familiares.length === 0) {
        console.log("No hay IDs de familiares.");
        callback([]); // Llamar al callback con un array vacío
        return;
      }

      // Obtener los documentos de los familiares
      const familiaresRef = collection(db, "usuarios");
      const q = query(familiaresRef, where("__name__", "in", this.familiares)); // Buscar por IDs

      // Escuchar cambios en tiempo real en los familiares
      const desuscribirse = onSnapshot(q, (querySnapshot) => {
        const familiares = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(), // Incluir todos los campos del familiar
        }));

        console.log("Familiares actualizados:", familiares); // Depuración
        callback(familiares); // Llamar al callback con los familiares actualizados
      });

      // Devolver la función para desuscribirse
      return desuscribirse;
    } catch (error) {
      console.error("Error obteniendo familiares:", error);
      callback([]); // En caso de error, llamar al callback con un array vacío
    }
  }

  obtenerSeguimiento(departamentoId, callback) {
    try {
      // Verificar si el departamentoId y el residenteId están definidos
      if (!departamentoId || !this.id) {
        console.log("Faltan datos necesarios: departamentoId o residenteId.");
        callback(null); // Llamar al callback con null
        return;
      }

      // Obtener los documentos de la colección "seguimientos"
      const seguimientosRef = collection(db, "seguimientos");

      // Crear una consulta para buscar el seguimiento correspondiente
      const q = query(
        seguimientosRef,
        where("departamentoId", "==", departamentoId),
        where("residenteId", "==", this.id),
      );

      // Escuchar cambios en tiempo real en los seguimientos
      const desuscribirse = onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.empty) {
          console.log("No se encontró ningún seguimiento.");
          callback(null); // Llamar al callback con null si no hay documentos
          return;
        }

        // Obtener el primer documento que coincida (asumimos que solo hay uno)
        const seguimiento = querySnapshot.docs[0].data();

        console.log("Seguimiento encontrado:", seguimiento); // Depuración
        callback(seguimiento); // Llamar al callback con el seguimiento encontrado
      });

      // Devolver la función para desuscribirse
      return desuscribirse;
    } catch (error) {
      console.error("Error obteniendo seguimiento:", error);
      callback(null); // En caso de error, llamar al callback con null
    }
  }
}

export default Residente;
