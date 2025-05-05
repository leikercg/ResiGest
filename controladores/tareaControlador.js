// controlador: tareaControlador.js
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../fireBaseConfig";
import Tarea from "../modelos/tarea";

class TareaControlador {
  static obtenerTareasPorUsuarioYFecha(usuarioId, fechaSeleccionada, callback) {
    // Normalizamos el día con inicio y fin, es necasario para poder comparar fechas en firebase sin horas, minutos y segundos
    const inicioDelDia = new Date(
      fechaSeleccionada.getFullYear(),
      fechaSeleccionada.getMonth(),
      fechaSeleccionada.getDate(),
      0,
      0,
      0,
      0,
    );

    const finDelDia = new Date(
      fechaSeleccionada.getFullYear(),
      fechaSeleccionada.getMonth(),
      fechaSeleccionada.getDate(),
      23,
      59,
      59,
      999,
    );

    const q = query(
      collection(db, "tareas"),
      where("usuarioId", "==", usuarioId),
      where("fecha", ">=", inicioDelDia),
      where("fecha", "<=", finDelDia),
      orderBy("fecha", "asc"),
    );

    return onSnapshot(q, (querySnapshot) => {
      const tareas = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return new Tarea(
          doc.id,
          data.fecha.toDate?.() ?? data.fecha,
          data.descripcion,
          data.residenteId,
          data.usuarioId,
          data.usuarioNombre,
          data.residenteNombre,
        );
      });

      callback(tareas);
    });
  }

  static async crearTarea(nuevaTarea) {
    try {
      const docRef = await addDoc(collection(db, "tareas"), {
        fecha: nuevaTarea.fecha,
        descripcion: nuevaTarea.descripcion,
        residenteId: nuevaTarea.residenteId,
        usuarioId: nuevaTarea.usuarioId,
        usuarioNombre: nuevaTarea.usuarioNombre,
        residenteNombre: nuevaTarea.residenteNombre,
      });
    } catch (error) {
      console.error("Error al crear tarea:", error);
    }
  }
  static async eliminarTarea(tareaId) {
    try {
      const tareaRef = doc(db, "tareas", tareaId);
      await deleteDoc(tareaRef);
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  }

  static async actualizarTarea(tareaId, datosActualizados) {
    try {
      const tareaRef = doc(db, "tareas", tareaId);
      await updateDoc(tareaRef, datosActualizados);
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  }

  // Eliminar todas las tareas de un residente, será usada al eleminar un residente
  static async eliminarTareasResidente(residenteId) {
    try {
      // Referencia a la collecion visitas
      const tareasRef = collection(db, "tareas");
      // Consulta para buscar las vistas del residente
      const q = query(tareasRef, where("residenteId", "==", residenteId));
      // Lista de documentos visita del residente
      const querySnapshot = await getDocs(q);

      // Eliminar todas las vistas
      const borrarTodas = querySnapshot.docs.map((doc) => deleteDoc(doc.ref)); // Borramos cada tarea en cada documento
      await Promise.all(borrarTodas); // Esperamos a que se eliminen todas las visitas
    } catch (error) {
      console.error("Error al eliminar visitas del residente:", error);
    }
  }
}

export default TareaControlador;
