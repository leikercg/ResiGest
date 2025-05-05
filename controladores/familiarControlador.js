import { db } from "../fireBaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  arrayRemove,
  writeBatch,
  orderBy,
} from "firebase/firestore";
import { eliminarUsuarioYCuenta } from "../services/authService";

class familiarControlador {
  // Método para escuchar en tiempo real los residentes relacionados con un familiar
  static escucharResidentesRelacionados(familiarId, callback) {
    const residentesRef = collection(db, "residentes");
    const q = query(
      residentesRef,
      where("familiares", "array-contains", familiarId),
    );

    // Escuchar cambios en tiempo real
    const desuscribirse = onSnapshot(q, (querySnapshot) => {
      const residentes = [];
      querySnapshot.forEach((doc) => {
        residentes.push({ id: doc.id, ...doc.data() });
      });
      callback(residentes); // Llamar al callback con los residentes actualizados
    });

    return desuscribirse; // Retornar la función para desuscribirse
  }

  // Método para listar familiares
  static listarFamiliares(callback) {
    // Para que funcione la ordenacion necesitamos crear un indice en firestore
    try {
      const familiaresRef = collection(db, "usuarios");
      // Consulta para familiares (departamentoId = 4) con ordenamiento por apellido y nombre
      const q = query(
        familiaresRef,
        where("departamentoId", "==", 4),
        orderBy("apellido"), // Orden principal por apellido
        orderBy("nombre"), // Orden secundario por nombre (en caso de apellidos iguales)
      );

      const desuscribirse = onSnapshot(q, (querySnapshot) => {
        // Escuchar cambios en la consulta
        const familiares = [];
        querySnapshot.forEach((documento) => {
          // Recorrer los documentos y extraer los datos
          const data = documento.data();
          familiares.push({
            id: documento.id,
            nombre: data.nombre,
            apellido: data.apellido,
            departamentoId: data.departamentoId,
            telefono: data.telefono,
          });
        });
        callback(familiares); // Llamar al callback con los datos ordenados, actualizando el estado
      });

      return desuscribirse; // Devolver la función para desuscribirse
    } catch (error) {
      console.error("Error al obtener los familiares:", error);
      throw error; // Propagar el error
    }
  }

  // Método para eliminar un familiar
  static async eliminarFamiliar(id, mostrarAlerta) {
    try {
      mostrarAlerta(
        "Eliminar familiar",
        "¿Estás seguro de que deseas eliminar a este familiar?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: async () => {
              try {
                const residentesRef = collection(db, "residentes");
                const q = query(
                  residentesRef,
                  where("familiares", "array-contains", id),
                );
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                  console.log("No se encontraron residentes asociados.");
                }

                // Crear un batch de escritura
                const batch = writeBatch(db);

                querySnapshot.forEach((doc) => {
                  const residenteRef = doc.ref;
                  console.log(
                    `Eliminando referencia de familiar en residente: ${residenteRef.id}`,
                  );

                  // Asegurar que se elimina el ID del familiar del array en cada residente
                  batch.update(residenteRef, {
                    familiares: arrayRemove(id),
                  });
                });

                // Si hay operaciones en el batch, ejecutarlas
                if (!querySnapshot.empty) {
                  await batch.commit();
                  console.log(
                    "Referencias eliminadas correctamente en todos los residentes.",
                  );
                }

                // Ahora eliminar el usuario de autenticación y Firestore
                await eliminarUsuarioYCuenta(id);
                console.log("Familiar eliminado correctamente.");
              } catch (error) {
                console.error("Error al eliminar el familiar:", error);
                mostrarAlerta("Error", "No se pudo eliminar el familiar.");
              }
            },
          },
        ],
      );
    } catch (error) {
      console.error("Error al confirmar la eliminación:", error);
      mostrarAlerta("Error", "Ocurrió un problema.");
    }
  }
}

export default familiarControlador;
