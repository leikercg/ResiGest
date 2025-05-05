// BACKEND DE FIREBASE:
const {onCall, HttpsError} = require("firebase-functions/v2/https"); // Importa HttpsError
const {getAuth} = require("firebase-admin/auth");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const {initializeApp} = require("firebase-admin/app");

// Inicializa Firebase Admin SDK
initializeApp();

exports.createUser = onCall(async (request) => {
  // Verificación de autenticación
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Debes estar autenticado para realizar esta acción.",
    );
  }

  // Obtener datos del usuario que hace la solicitud
  const userId = request.auth.uid;
  const db = getFirestore();

  // Verificar si el usuario existe en Firestore
  const userDoc = await db.collection("usuarios").doc(userId).get();
  if (!userDoc.exists) {
    throw new HttpsError(
      "not-found",
      "El usuario no existe en la base de datos.",
    );
  }

  // Verificar permisos (solo departamento 1 puede crear usuarios)
  const userData = userDoc.data();
  const departamentoId = userData.departamentoId;
  if (departamentoId !== 1) {
    throw new HttpsError(
      "permission-denied",
      "Solo los usuarios del departamento 1 pueden crear usuarios.",
    );
  }

  // Extraer datos del nuevo usuario del request
  const {email, password, nombre, apellido, telefono, nuevoDepartamentoId, residenteId} = request.data;
  // Destructuración de los datos del request

  try {
    // Crear usuario en Authentication
    const auth = getAuth();
    const userRecord = await auth.createUser({
      email,
      password,
    });

    // Crear documento del usuario en Firestore
    await db.collection("usuarios").doc(userRecord.uid).set({
      email,
      nombre,
      apellido,
      telefono,
      departamentoId: nuevoDepartamentoId,
    });

    // Si se pasó residenteId asociar el familiar al residente
    if (residenteId) {
      const residenteRef = db.collection("residentes").doc(residenteId);
      await residenteRef.update({
        familiares: FieldValue.arrayUnion(userRecord.uid), // Agrega el UID a array
      });
    }

    return {message: "Usuario creado exitosamente.", uid: userRecord.uid};
  } catch (error) {
    console.error("Error en la Cloud Function:", error);
    throw new HttpsError("internal", error.message);
  }
});
