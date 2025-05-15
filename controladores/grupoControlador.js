import {
  collection,
  updateDoc,
  getDoc,
  doc,
  query,
  where,
  deleteDoc,
  onSnapshot,
  orderBy,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../fireBaseConfig";
import Grupo from "../modelos/grupo";

class GrupoControlador {
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

  // Método para eliminar un residente de un grupo
  static async removerResidenteDeGrupo(grupoId, residenteId) {
    try {
      const grupoRef = doc(db, "grupos", grupoId);

      // Primero verificamos que el grupo exista
      const grupoSnap = await getDoc(grupoRef);
      if (!grupoSnap.exists()) {
        throw new Error("El grupo no existe");
      }

      // Obtenemos los residentes actuales
      const grupoData = grupoSnap.data();
      const residentesActuales = grupoData.residentes || [];

      // Verificamos que el residente esté en el grupo
      if (!residentesActuales.includes(residenteId)) {
        throw new Error("El residente no pertenece a este grupo");
      }

      // Si es el último residente, eliminamos el grupo completo
      if (residentesActuales.length === 1) {
        await deleteDoc(grupoRef);
        return {
          eliminado: true,
          mensaje: "Grupo eliminado al quedar sin residentes",
        };
      }

      // Si hay más residentes, solo removemos este residente
      await updateDoc(grupoRef, {
        residentes: arrayRemove(residenteId),
      });

      return { eliminado: false, mensaje: "Residente removido del grupo" };
    } catch (error) {
      console.error("Error al remover residente del grupo:", error);
      throw error;
    }
  }
}

export default GrupoControlador;
