import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../fireBaseConfig";
import Empleado from "../modelos/empleado";
import { eliminarUsuarioYCuenta } from "../services/authService";
import Cura from "../modelos/cura";
import Visita from "../modelos/visita";

class EmpleadoControlador {
  // Método para listar empleados
  static listarEmpleados(callback) {
    try {
      const empleadosRef = collection(db, "usuarios");

      // Consulta base con filtro por departamento y siempre ordenada
      const q = query(
        empleadosRef,
        where("departamentoId", "in", [2, 3, 5, 6, 7]), // Filtra empleados (Todos menos familiares y el Admin)
        orderBy("apellido"), // Ordenar por apellido en servidor
        orderBy("nombre"), // Segundo criterio de ordenamiento
      );

      const desuscribirse = onSnapshot(q, (querySnapshot) => {
        const empleados = [];
        querySnapshot.forEach((documento) => {
          const data = documento.data();
          // Crear una instancia del modelo Empleado
          const empleado = new Empleado(
            documento.id,
            data.email,
            data.nombre,
            data.apellido,
            data.departamentoId,
            data.telefono,
          );
          empleados.push(empleado);
        });
        callback(empleados); // Devolver la lista de empleados, actualizando el estado
      });

      return desuscribirse; // Devolver la función para desuscribirse
    } catch (error) {
      console.error("Error al obtener los empleados:", error);
      throw error; // Propagar el error
    }
  }

  // Método para eliminar un empleado
  static eliminarEmpleado(id, mostrarAlerta) {
    try {
      mostrarAlerta(
        "Eliminar empleado",
        "¿Estás seguro de que deseas eliminar a este empleado?",
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
                // Eliminamos el empleado y su cuenta
                await eliminarUsuarioYCuenta(id);
              } catch (error) {
                console.error("Error al eliminar el empleado:", error);
                mostrarAlerta("Error", "No se pudo eliminar el empleado.");
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

  static obtenerCurasPorEmpleadoYFecha(usuarioId, fechaSeleccionada, callback) {
    // Preparamos el rango de fechas
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

    // Creamos la consulta
    const q = query(
      collection(db, "curas"),
      where("usuarioId", "==", usuarioId),
      where("fecha", ">=", inicioDelDia),
      where("fecha", "<=", finDelDia),
      orderBy("fecha", "asc"),
    );

    // Escuchamos cambios en tiempo real
    return onSnapshot(q, (querySnapshot) => {
      const curas = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return new Cura(
          doc.id,
          data.fecha.toDate(),
          data.zona,
          data.observacion,
          data.residenteId,
          data.usuarioId,
          data.usuarioNombre,
          data.residenteNombre,
        );
      });

      callback(curas);
    });
  }

  static obtenerVisitasPorEmpleadoYFecha(
    usuarioId,
    fechaSeleccionada,
    callback,
  ) {
    // Definir el rango del día completo (00:00:00 a 23:59:59)
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
      collection(db, "visitas"),
      where("usuarioId", "==", usuarioId),
      where("fecha", ">=", inicioDelDia),
      where("fecha", "<=", finDelDia),
      orderBy("fecha", "asc"),
    );

    return onSnapshot(q, (querySnapshot) => {
      const visitas = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return new Visita(
          doc.id,
          data.fecha.toDate(),
          data.motivo,
          data.residenteId,
          data.usuarioId,
          data.usuarioNombre,
          data.residenteNombre,
        );
      });
      callback(visitas);
    });
  }
}

export default EmpleadoControlador;
