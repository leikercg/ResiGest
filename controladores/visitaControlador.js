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
import Visita from "../modelos/visita";

class VisitasControlador {
  // Mostrar las visitas de un residente
  static obtenerVisitas(residenteId, callback) {
    const q = query(
      collection(db, "visitas"),
      where("residenteId", "==", residenteId),
      orderBy("fecha", "desc"),
    );

    return onSnapshot(q, (querySnapshot) => {
      const visitasData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        // Creamos instancias del modelo Visita
        return new Visita(
          doc.id,
          data.fecha,
          data.motivo,
          data.residenteId,
          data.usuarioId,
          data.usuarioNombre,
        );
      });

      callback({ visitas: visitasData });
    });
  }

  static async crearVisita(
    residenteId,
    motivo,
    fecha,
    usuarioId,
    residenteNombre,
  ) {
    try {
      const usuarioDoc = await getDoc(doc(db, "usuarios", usuarioId));
      const data = usuarioDoc.data();
      const usuarioNombre = `${data.nombre} ${data.apellido}`;

      await addDoc(collection(db, "visitas"), {
        residenteId,
        motivo: motivo.trim(),
        fecha,
        usuarioId,
        usuarioNombre,
        residenteNombre,
      });
    } catch (error) {
      console.error("Error al crear visita:", error);
      throw new Error("No se pudo crear la visita");
    }
  }

  // Método para actualizaruna vista
  static async actualizarVisita(visitaId, motivo, fecha) {
    try {
      await updateDoc(doc(db, "visitas", visitaId), {
        motivo: motivo.trim(),
        fecha,
      });
      return { success: true, message: "Visita actualizada correctamente" };
    } catch (error) {
      console.error("Error al actualizar visita:", error);
    }
  }

  // Método para eliminar una visita en concreto
  static async eliminarVisita(visitaId) {
    try {
      await deleteDoc(doc(db, "visitas", visitaId));
      return { success: true, message: "Visita eliminada correctamente" };
    } catch (error) {
      console.error("Error al eliminar visita:", error);
    }
  }

  // Eliminar todas las visitas de un residente, será usada al eleminar un residente
  static async eliminarVisitasResidente(residenteId) {
    try {
      // Referencia a la collecion visitas
      const visitasRef = collection(db, "visitas");
      // Consulta para buscar las vistas del residente
      const q = query(visitasRef, where("residenteId", "==", residenteId));
      // Lista de documentos visita del residente
      const querySnapshot = await getDocs(q);

      // Eliminar todas las vistas
      const borrarTodas = querySnapshot.docs.map((doc) => deleteDoc(doc.ref)); // Borramos cada visita en cada documento
      await Promise.all(borrarTodas); // Esperamos a que se eliminen todas las visitas
    } catch (error) {
      console.error("Error al eliminar visitas del residente:", error);
    }
  }
}

export default VisitasControlador;
