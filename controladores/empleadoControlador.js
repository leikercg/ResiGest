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
import Sesion from "../modelos/sesion";
import Grupo from "../modelos/grupo";

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
  // Métodod que de las curas por empleado y fecha
  static obtenerCurasPorEmpleadoYFecha(usuarioId, fechaSeleccionada, callback) {
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
  // Método para obtener visitas por empleado y fecha
  static obtenerVisitasPorEmpleadoYFecha(
    usuarioId,
    fechaSeleccionada,
    callback,
  ) {
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
  // Método para obtener sesiones por empleado y fecha
  static obtenerSesionesPorEmpleadoYFecha(
    usuarioId,
    fechaSeleccionada,
    callback,
  ) {
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
      collection(db, "sesiones"),
      where("usuarioId", "==", usuarioId),
      where("fecha", ">=", inicioDelDia),
      where("fecha", "<=", finDelDia),
      orderBy("fecha", "asc"),
    );

    return onSnapshot(q, (querySnapshot) => {
      const visitas = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return new Sesion(
          doc.id,
          data.fecha.toDate(),
          data.descripcion,
          data.residenteId,
          data.usuarioId,
          data.usuarioNombre,
          data.residenteNombre,
        );
      });
      callback(visitas);
    });
  }

  // Método para obtener sesiones por empleado y fecha
  static obtenerGruposPorEmpleadoYFecha(
    usuarioId,
    fechaSeleccionada,
    callback,
  ) {
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
      collection(db, "grupos"),
      where("usuarioId", "==", usuarioId),
      where("fecha", ">=", inicioDelDia),
      where("fecha", "<=", finDelDia),
      orderBy("fecha", "asc"),
    );

    return onSnapshot(q, (querySnapshot) => {
      const grupos = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return new Grupo(
          doc.id,
          data.descripcion,
          data.fecha.toDate(),
          data.residenteId,
          data.usuarioId,
          data.nombreUsuario,
          data.residentes,
        );
      });
      console.log("Grupos obtenidos:", grupos);
      callback(grupos);
    });
  }
}

export default EmpleadoControlador;
