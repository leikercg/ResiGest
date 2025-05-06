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
import Cura from "../modelos/cura";

class CurasControlador {
  // Méotodo para obtener las curas de un residente
  static obtenerCuras(residenteId, callback) {
    const q = query(
      collection(db, "curas"),
      where("residenteId", "==", residenteId),
      orderBy("fecha", "desc"),
    );

    return onSnapshot(q, (querySnapshot) => {
      // Para escuchar en tiempo real
      const curasData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return new Cura(
          doc.id,
          data.fecha,
          data.zona,
          data.observacion,
          data.residenteId,
          data.usuarioId,
          data.usuarioNombre,
        );
      });

      callback({ curas: curasData }); // Actualizamos el estado con un callback
    });
  }

  // Método para crear una cura
  static async crearCura(
    residenteId,
    zona,
    observacion,
    fecha,
    usuarioId,
    residenteNombre,
  ) {
    try {
      const usuarioDoc = await getDoc(doc(db, "usuarios", usuarioId));
      const data = usuarioDoc.data();
      const usuarioNombre = `${data.nombre} ${data.apellido}`;

      await addDoc(collection(db, "curas"), {
        residenteId,
        zona: zona.trim(),
        observacion: observacion.trim(),
        fecha,
        usuarioId,
        usuarioNombre,
        residenteNombre,
      });
    } catch (error) {
      console.error("Error al crear cura:", error);
    }
  }

  // Método para actualizar una cura
  static async actualizarCura(curaId, zona, observacion, fecha) {
    try {
      await updateDoc(doc(db, "curas", curaId), {
        zona: zona.trim(),
        observacion: observacion.trim(),
        fecha,
      });
      return { success: true, message: "Cura actualizada correctamente" };
    } catch (error) {
      console.error("Error al actualizar cura:", error);
    }
  }

  // Método para elimnar una cura
  static async eliminarCura(curaId) {
    try {
      await deleteDoc(doc(db, "curas", curaId));
      return { success: true, message: "Cura eliminada correctamente" };
    } catch (error) {
      console.error("Error al eliminar cura:", error);
    }
  }

  // Método para elimnar todas las curas de un residente al ser borrado
  static async eliminarCurasResidente(residenteId) {
    try {
      const curasRef = collection(db, "curas");
      const q = query(curasRef, where("residenteId", "==", residenteId));
      const querySnapshot = await getDocs(q);

      const borrarTodas = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(borrarTodas);
    } catch (error) {
      console.error("Error al eliminar curas del residente:", error);
    }
  }
}

export default CurasControlador;
