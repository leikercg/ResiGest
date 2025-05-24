import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../fireBaseConfig";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../fireBaseConfig";

const functions = getFunctions(app);

export const registerUser = async (
  email,
  password,
  nombre,
  apellido,
  telefono,
  departamentoId,
  residenteId,
) => {
  try {
    const createUser = httpsCallable(functions, "createUser");
    const result = await createUser({
      email,
      password,
      nombre,
      apellido,
      telefono,
      nuevoDepartamentoId: departamentoId,
      residenteId, // Pasar el ID del residente seleccionado
    });
    return result.data;
  } catch (error) {
    throw new Error("Error al registrar el usuario: " + error.message);
  }
};

// Función para eliminar un empleado y su cuenta de autenticación
export const eliminarUsuarioYCuenta = async (id) => {
  try {
    // Eliminar el empleado de Firestore
    await deleteDoc(doc(db, "usuarios", id));
    console.log("Empleado eliminado de Firestore");

    // Llamar a la Cloud Function para eliminar la cuenta de autenticación
    const functions = getFunctions();
    const deleteUserAccount = httpsCallable(functions, "deleteUserAccount");

    const result = await deleteUserAccount({ id });
    console.log(result.data.message);
  } catch (error) {
    console.error("Error al eliminar el empleado:", error);
    throw new Error("No se pudo eliminar el empleado.");
  }
};
