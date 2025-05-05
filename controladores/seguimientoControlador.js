import {
  collection,
  updateDoc,
  setDoc,
  doc,
  query,
  getDocs,
  where,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../fireBaseConfig";
import Seguimiento from "../modelos/seguimiento";

class SeguimientoControlador {
  // Método para eliminar todos los seguimientos de un residente
  static async eliminarSeguimientosResidente(residenteId) {
    try {
      const seguimientosRef = collection(db, "seguimientos");
      const q = query(seguimientosRef, where("residenteId", "==", residenteId));
      const querySnapshot = await getDocs(q);

      for (const doc of querySnapshot.docs) {
        await deleteDoc(doc.ref);
        console.log(`Seguimiento ${doc.id} eliminado`);
      }
    } catch (error) {
      console.error("Error al eliminar los seguimientos:", error);
      throw error;
    }
  }

  // Método para crear seguimientos en lote
  static async crearSeguimientosEnLote(residenteId) {
    try {
      const departamentos = [2, 3, 5, 6, 7];

      for (const departamentoId of departamentos) {
        const seguimientoRef = doc(collection(db, "seguimientos"));
        const nuevoSeguimiento = new Seguimiento(
          seguimientoRef.id,
          departamentoId,
          residenteId,
          [],
        );

        await setDoc(seguimientoRef, {
          departamentoId: nuevoSeguimiento.departamentoId,
          residenteId: nuevoSeguimiento.residenteId,
          detalles: nuevoSeguimiento.detalles,
        });
      }
    } catch (error) {
      console.error("Error al crear los seguimientos:", error);
      throw error;
    }
  }

  // Método para buscar seguimiento
  static async buscarSeguimiento(residenteId, departamentoId) {
    try {
      const seguimientosRef = collection(db, "seguimientos");
      const q = query(
        seguimientosRef,
        where("residenteId", "==", residenteId),
        where("departamentoId", "==", departamentoId),
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const seguimientoDoc = querySnapshot.docs[0];
      const data = seguimientoDoc.data();
      // Creamos una instancia del modelo Seguimiento
      return new Seguimiento(
        seguimientoDoc.id,
        data.departamentoId,
        data.residenteId,
        data.detalles || [],
      );
    } catch (error) {
      console.error("Error al buscar el seguimiento:", error);
      throw error;
    }
  }

  // Método actualizado para agregar detalle con estructura de objeto
  static async agregarDetalleSeguimiento(
    residenteId,
    departamentoId,
    comentario,
    usuarioId,
  ) {
    try {
      // Buscar el seguimiento existente
      const seguimiento = await SeguimientoControlador.buscarSeguimiento(
        residenteId,
        departamentoId,
      );

      if (!seguimiento) {
        throw new Error("No se encontró el seguimiento.");
      }

      // Obtener datos del usuario
      const usuarioDoc = await getDoc(doc(db, "usuarios", usuarioId));
      const { nombre, apellido } = usuarioDoc.data();
      const nombreCompleto = `${nombre} ${apellido}`;

      // Crear el nuevo detalle como objeto e
      const nuevoDetalle = {
        fecha: new Date(),
        fechaFormateada: new Date().toLocaleString(),
        usuarioId: usuarioId,
        usuarioNombre: nombreCompleto,
        comentario: comentario,
      };

      // Obtener el array actual de detalles y agregar el nuevo al inicio
      const seguimientoDoc = await getDoc(
        doc(db, "seguimientos", seguimiento.id),
      );
      const datosSeguimiento = seguimientoDoc.data();
      const detallesActuales = datosSeguimiento.detalles || []; // Si existe y no es nulo usar un array vacio

      const nuevosDetalles = [nuevoDetalle, ...detallesActuales]; // Insertar al inicio con el operador spread

      // Actualizar el documento con el nuevo array completo
      await updateDoc(doc(db, "seguimientos", seguimiento.id), {
        detalles: nuevosDetalles,
      });
    } catch (error) {
      console.error("Error al agregar detalle:", error);
      throw error;
    }
  }
}

export default SeguimientoControlador;
