import {
  collection,
  updateDoc,
  doc,
  query,
  where,
  deleteDoc,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../fireBaseConfig";
import Grupo from "../modelos/grupo";

class GrupoControlador {
  // Método para crear un nuevo grupo
  static async crearGrupo(
    descripcion,
    usuarioId,
    nombreUsuario,
    residentesIds,
    fecha,
  ) {
    try {
      // Crear el documento
      const docRef = await addDoc(collection(db, "grupos"), {
        descripcion: descripcion.trim(),
        usuarioId,
        nombreUsuario,
        residentes: residentesIds,
        fecha,
        fechaCreacion: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error al crear grupo:", error);
      throw error;
    }
  }

  // Método para actualizar un grupo existente
  static async actualizarGrupo(
    grupoId,
    { descripcion, fecha, residentesSeleccionados },
  ) {
    try {
      await updateDoc(doc(db, "grupos", grupoId), {
        descripcion: descripcion,
        fecha: fecha,
        residentes: residentesSeleccionados,
      });
    } catch (error) {
      console.error("Error al actualizar grupo:", error);
      throw error;
    }
  }
  // Método para obtener todos los grupos por fecha
  static obtenerTodosLosGrupos(fecha, callback) {
    const inicioDia = new Date(fecha);
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date(fecha);
    finDia.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, "grupos"),
      where("fecha", ">=", inicioDia),
      where("fecha", "<=", finDia),
      orderBy("fecha", "desc"),
    );

    return onSnapshot(q, (querySnapshot) => {
      const grupos = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return new Grupo(
          doc.id,
          data.descripcion,
          data.fecha.toDate(),
          data.usuarioId,
          data.nombreUsuario || "",
          data.residentes || [],
        );
      });
      callback(grupos);
    });
  }

  // Método para obtener grupos en tiempo real por residente
  static obtenerGruposPorResidente(residenteId, callback) {
    const q = query(
      collection(db, "grupos"),
      where("residentes", "array-contains", residenteId),
      orderBy("fecha", "desc"),
    );

    return onSnapshot(q, (querySnapshot) => {
      const grupos = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return new Grupo(
          doc.id,
          data.descripcion,
          data.fecha.toDate(),
          data.usuarioId,
          data.nombreUsuario || data.usuarioNombre || "",
          data.residentes || [],
        );
      });
      callback(grupos);
    });
  }

  // Método para eliminar un grupo entero
  static async eliminargrupo(grupoId) {
    try {
      await deleteDoc(doc(db, "grupos", grupoId));
      return { success: true, message: "Grupo eliminada correctamente" };
    } catch (error) {
      console.error("Error al eliminar grupo:", error);
    }
  }
}

export default GrupoControlador;
