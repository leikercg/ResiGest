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
  getDocs,
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

  static async eliminarReferenciasResidenteEnGrupos(residenteId) {
    try {
      // Referencia a la colección grupos
      const gruposRef = collection(db, "grupos");

      // Buscar todos los grupos que contengan al residente en su array residentes
      const q = query(
        gruposRef,
        where("residentes", "array-contains", residenteId),
      );
      const querySnapshot = await getDocs(q);

      // Cremos un array de promesas para eliminar al residente de cada grupo
      const actualizaciones = querySnapshot.docs.map(async (doc) => {
        const grupoData = doc.data();

        // Deja fuera al residente pasado por parámetro
        const nuevosResidentes = grupoData.residentes.filter(
          (id) => id !== residenteId,
        );

        // Si el grupo queda vacío, lo eliminamos
        if (nuevosResidentes.length === 0) {
          await this.eliminarGrupo(doc.id);
        }
        // Si no, lo actualizamos
        else {
          await updateDoc(doc.ref, {
            residentes: nuevosResidentes,
          });
        }
      });

      // Ejecutar todas las actualizaciones en paralelo y se espera a que todas se haya completado
      await Promise.all(actualizaciones);
    } catch (error) {
      console.error(
        "Error al eliminar referencias del residente en grupos:",
        error,
      );
    }
  }
}

export default GrupoControlador;
