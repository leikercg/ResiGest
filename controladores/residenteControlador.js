import {
  doc,
  deleteDoc,
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  where,
  getDoc,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../fireBaseConfig";
import Residente from "../modelos/residente";
import SeguimientoControlador from "./seguimientoControlador";
import VisitaControlador from "./visitaControlador";
import TareaControlador from "./tareaControlador";
import CurasControlador from "./curaControlador";
import SesionControlador from "./sesionCotrolador";
import GrupoControlador from "./grupoControlador";

class ResidenteControlador {
  // Método para escuchar cambios en los familiares de un residente
  static escucharCambiosFamiliares(residenteId, callback) {
    try {
      // Obtener el residente para acceder a los IDs de sus familiares
      const residenteRef = doc(db, "residentes", residenteId);

      // Escuchar cambios en el residente
      const unsubscribeResidente = onSnapshot(residenteRef, (residenteDoc) => {
        if (!residenteDoc.exists()) {
          console.log("Residente no encontrado.");
          callback([]); // Devolver un array vacío si el residente no existe
          return;
        }

        const residenteData = residenteDoc.data();
        const familiaresIds = residenteData.familiares || []; // Array de IDs de familiares

        // Si no hay familiares, devolver un array vacío
        if (familiaresIds.length === 0) {
          callback([]);
          return;
        }

        // Obtener los documentos de los familiares
        const familiaresRef = collection(db, "familiares");
        const q = query(familiaresRef, where("__name__", "in", familiaresIds)); // Buscar por IDs

        // Escuchar cambios en los familiares
        const unsubscribeFamiliares = onSnapshot(q, (querySnapshot) => {
          const familiares = [];
          querySnapshot.forEach((doc) => {
            const familiarData = doc.data();
            familiares.push({
              id: doc.id,
              ...familiarData, // Incluir todos los campos del familiar
            });
          });

          callback(familiares); // Llamar al callback con la lista de familiares
        });

        // Devolver una función para desuscribirse de ambas suscripciones
        return () => {
          unsubscribeResidente();
          unsubscribeFamiliares();
        };
      });

      // Devolver la función para desuscribirse
      return unsubscribeResidente;
    } catch (error) {
      console.error("Error escuchando cambios en los familiares:", error);
      throw error;
    }
  }
  // Método para escuchar cambios en tiempo real de un residente específico
  static escucharCambiosResidente(id, callback) {
    try {
      const residenteRef = doc(db, "residentes", id); // Referencia al documento del residente
      const unsubscribe = onSnapshot(residenteRef, (residenteDoc) => {
        if (residenteDoc.exists()) {
          const residenteData = residenteDoc.data();

          // Convertir el objeto plano en una instancia de la clase Residente
          const residente = new Residente(
            residenteDoc.id,
            residenteData.nombre,
            residenteData.apellido,
            residenteData.fecha_nacimiento,
            residenteData.fecha_ingreso,
            residenteData.familiares,
          );

          callback(residente); // Llamar al callback con la instancia de Residente
        } else {
          console.log("No se encuentra el residente."); // Debug
          callback(null); // Llamar al callback con null si el residente no existe
        }
      });

      return unsubscribe; // Devolver la función para desuscribirse
    } catch (error) {
      console.error("Error escuchando cambios del residente:", error);
      throw error;
    }
  }

  // Método para eliminar un residente con confirmación
  // En ResidenteControlador.js

  static async eliminarResidente(id, mostrarAlerta) {
    try {
      mostrarAlerta(
        "Eliminar Residente",
        "¿Estás seguro de que deseas eliminar a este residente?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Eliminar",
            onPress: async () => {
              try {
                // Obtener datos del residente
                const residenteDoc = await getDoc(doc(db, "residentes", id));
                if (!residenteDoc.exists()) {
                  throw new Error("Residente no encontrado");
                }

                const familiaresIds = residenteDoc.data().familiares || [];

                // Eliminar elementos asociados
                await VisitaControlador.eliminarVisitasResidente(id);
                await SeguimientoControlador.eliminarSeguimientosResidente(id);
                await TareaControlador.eliminarTareasResidente(id);
                await CurasControlador.eliminarCurasResidente(id);
                await SesionControlador.eliminarSesionesResidente(id);
                await GrupoControlador.eliminarReferenciasResidenteEnGrupos(id);

                // Eliminar residente
                await deleteDoc(doc(db, "residentes", id));

                // Eliminar familiares no referenciados
                await this.eliminarFamiliaresSinReferencias(familiaresIds);

                console.log("Eliminación completada exitosamente");
                mostrarAlerta(
                  "Éxito",
                  "Residente y datos asociados eliminados correctamente",
                );
              } catch (error) {
                console.error("Error durante eliminación:", error);
                mostrarAlerta(
                  "Error",
                  "No se pudo completar la eliminación: " + error.message,
                );
              }
            },
            style: "destructive",
          },
        ],
      );
    } catch (error) {
      console.error("Error al mostrar alerta:", error);
      mostrarAlerta("Error", "No se pudo iniciar el proceso de eliminación");
    }
  }
  static async eliminarFamiliaresSinReferencias(familiaresIds) {
    if (!familiaresIds || familiaresIds.length === 0) return;

    try {
      // Obtener todos los residentes para verificar referencias
      const residentesSnapshot = await getDocs(collection(db, "residentes"));
      const residentesConFamiliares = residentesSnapshot.docs
        .filter(
          (doc) => doc.data().familiares && doc.data().familiares.length > 0,
        )
        .flatMap((doc) => doc.data().familiares);

      // Filtrar familiares que no están en ningún otro residente
      const familiaresAEliminar = familiaresIds.filter(
        (familiarId) => !residentesConFamiliares.includes(familiarId),
      );

      // Eliminar familiares no referenciados
      for (const familiarId of familiaresAEliminar) {
        await deleteDoc(doc(db, "usuarios", familiarId));
        console.log(`Familiar ${familiarId} eliminado (sin referencias)`);
      }

      if (familiaresAEliminar.length === 0) {
        console.log("No se eliminaron familiares (todos tienen referencias)");
      }
    } catch (error) {
      console.error("Error verificando familiares:", error);
      throw error;
    }
  }

  // Método para listar residentes en tiempo real
  static listarResidentes(callback) {
    // Esto me ha pedido crear indices en la base de datos ----------------> REVISARRRRRRRRRRRRRRRRRRRR
    try {
      const residentesRef = collection(db, "residentes");
      // Consulta con ordenamiento por apellido y nombre
      const q = query(
        residentesRef,
        orderBy("apellido"), // Orden principal por apellido
        orderBy("nombre"), // Orden secundario por nombre (en caso de apellidos iguales)
      );

      const desuscribirse = onSnapshot(q, (querySnapshot) => {
        const residentes = [];
        querySnapshot.forEach((doc) => {
          const {
            nombre,
            apellido,
            fecha_nacimiento,
            fecha_ingreso,
            familiares,
          } = doc.data();

          // Crear una instancia del modelo Residente
          const residente = new Residente(
            doc.id,
            nombre,
            apellido,
            fecha_nacimiento,
            fecha_ingreso,
            familiares,
          );

          residentes.push(residente);
        });

        callback(residentes); // Devolver la lista de residentes ordenada
      });

      return desuscribirse; // Devolver la función para desuscribirse
    } catch (error) {
      console.error("Error listando residentes:", error);
      throw error; // Propagar el error
    }
  }

  // Método para guardar un residente con confirmación
  static async guardarResidente(id, residente, navigation, mostrarAlerta) {
    try {
      mostrarAlerta(
        "Confirmar",
        "¿Estás seguro de que deseas guardar este residente?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Confirmar",
            onPress: async () => {
              try {
                let residenteId = id; // ID del residente (si ya existe)

                // Guardar o actualizar el residente
                if (residenteId) {
                  await updateDoc(
                    doc(db, "residentes", residenteId),
                    residente,
                  );
                  console.log("Residente actualizado con ID:", residenteId);
                } else {
                  const docRef = await addDoc(
                    collection(db, "residentes"),
                    residente,
                  );
                  residenteId = docRef.id; // Obtener el ID del nuevo residente
                  console.log("Residente guardado con ID:", residenteId);
                  // Crear los seguimientos para los departamentos 2, 3 y 4 en un solo lote
                  await SeguimientoControlador.crearSeguimientosEnLote(
                    residenteId,
                  );
                }

                /////////////////////////////////////////////////////////////////////////////////añadir aqui debug
                // Navegar de regreso
                navigation.goBack();
              } catch (error) {
                console.error("Error al guardar el residente:", error);
                mostrarAlerta("Error", "No se pudo guardar el residente.");
              }
            },
          },
        ],
        { cancelable: false },
      );
    } catch (error) {
      console.error("Error al iniciar la confirmación de guardado:", error);
      mostrarAlerta("Error", "Ocurrió un problema.");
    }
  }
  // Método para obtener el itinerario de un residente en una fecha específica
  static obtenerItinerarioResidente(residenteId, fechaSeleccionada, callback) {
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

    // Consultas para cada tipo
    const queries = [
      query(
        collection(db, "curas"),
        where("residenteId", "==", residenteId),
        where("fecha", ">=", inicioDelDia),
        where("fecha", "<=", finDelDia),
        orderBy("fecha", "des"),
      ),
      query(
        collection(db, "visitas"),
        where("residenteId", "==", residenteId),
        where("fecha", ">=", inicioDelDia),
        where("fecha", "<=", finDelDia),
        orderBy("fecha", "asc"),
      ),
      query(
        collection(db, "sesiones"),
        where("residenteId", "==", residenteId),
        where("fecha", ">=", inicioDelDia),
        where("fecha", "<=", finDelDia),
        orderBy("fecha", "asc"),
      ),
      query(
        collection(db, "grupos"),
        where("residentes", "array-contains", residenteId),
        where("fecha", ">=", inicioDelDia),
        where("fecha", "<=", finDelDia),
        orderBy("fecha", "asc"),
      ),
      query(
        collection(db, "tareas"),
        where("residenteId", "==", residenteId),
        where("fecha", ">=", inicioDelDia),
        where("fecha", "<=", finDelDia),
        orderBy("fecha", "asc"),
      ),
    ];

    const resultados = [];
    const desuscripciones = [];

    queries.forEach((q, index) => {
      const tipo = ["cura", "visita", "sesion", "grupo", "tarea"][index];
      const unsuscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          // Detectar cambios, para no recorrer toda la lista
          if (change.type === "added") {
            const data = change.doc.data();
            resultados.push({
              id: change.doc.id,
              tipo,
              fecha: data.fecha.toDate(),
              ...data,
            });
          }
        });

        // Ordenar todos los resultados por fecha
        const resultadosOrdenados = [...resultados].sort(
          (a, b) => a.fecha - b.fecha,
        );
        callback(resultadosOrdenados);
      });

      desuscripciones.push(unsuscribe);
    });

    return () => desuscripciones.forEach((unsuscribe) => unsuscribe());
  }
}

export default ResidenteControlador;
