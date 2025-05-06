import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  addDoc,
  getDoc,
  deleteDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../fireBaseConfig";
import Sesion from "../modelos/sesion";

class SesionesControlador {
  // Mostrar las sesiones de un residente
  static obtenerSesiones(residenteId, callback) {
    const q = query(
      collection(db, "sesiones"),
      where("residenteId", "==", residenteId),
      orderBy("fecha", "desc"),
    );
    console.log(residenteId + " residenteId");

    return onSnapshot(q, (querySnapshot) => {
      const sesionesData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return new Sesion(
          doc.id,
          data.fecha,
          data.descripcion,
          data.residenteId,
          data.usuarioId,
          data.usuarioNombre,
          data.residenteNombre,
        );
      });

      console.log("Sesiones:", sesionesData);
      // Actualizamos el estado con un callback
      callback({ sesiones: sesionesData });
    });
  }

  static async crearSesion(
    residenteId,
    descripcion,
    fecha,
    usuarioId,
    residenteNombre,
  ) {
    try {
      const usuarioDoc = await getDoc(doc(db, "usuarios", usuarioId));
      const data = usuarioDoc.data();
      const usuarioNombre = `${data.nombre} ${data.apellido}`;

      await addDoc(collection(db, "sesiones"), {
        residenteId,
        descripcion: descripcion.trim(),
        fecha,
        usuarioId,
        usuarioNombre,
        residenteNombre,
      });
    } catch (error) {
      console.error("Error al crear sesión:", error);
      throw new Error("No se pudo crear la sesión");
    }
  }

  // Método para actualizaruna sesión
  static async actualizarSesion(sesionId, descripcion, fecha) {
    try {
      await updateDoc(doc(db, "sesiones", sesionId), {
        descripcion: descripcion.trim(),
        fecha,
      });
      return { success: true, message: "Sesión actualizada correctamente" };
    } catch (error) {
      console.error("Error al actualizar sesión:", error);
    }
  }

  // Método para eliminar una visita en concreto
  static async eliminarSesion(sesionId) {
    try {
      await deleteDoc(doc(db, "sesiones", sesionId));
      return { success: true, message: "Sesión eliminada correctamente" };
    } catch (error) {
      console.error("Error al eliminar sesión:", error);
    }
  }

  // Eliminar todas las sesiones de un residente, será usada al eleminar un residente
  static async eliminarSesionesResidente(residenteId) {
    try {
      // Referencia a la collecion sesiones
      const sesionesRef = collection(db, "sesiones");
      // Consulta para buscar las sesiones del residente
      const q = query(sesionesRef, where("residenteId", "==", residenteId));
      // Lista de documentos sesione del residente
      const querySnapshot = await getDocs(q);

      // Eliminar todas las sesiones
      const borrarTodas = querySnapshot.docs.map((doc) => deleteDoc(doc.ref)); // Borramos cada sesión en cada documento
      await Promise.all(borrarTodas); // Esperamos a que se eliminen todas las sesiones
    } catch (error) {
      console.error("Error al eliminar sesiones del residente:", error);
    }
  }
}

export default SesionesControlador;
