import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../fireBaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();
// Usaremos esto para acceder al departamento, y usuaro

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [departamentoId, setDepartamentoId] = useState(null);
  const [cargando, setcargando] = useState(true);

  useEffect(() => {
    // Método que esucha cambios en la autenticación de usuario, auth es el servicio de autenticación, authUser es el objeto usuario que contiene los datos del usurio
    const desuscribirse = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Obtener datos del usuario en Firestore
        const userDoc = await getDoc(doc(db, "usuarios", authUser.uid));
        // Establecemos el usuario y el departamentoId
        setUser(authUser);
        setDepartamentoId(userDoc.data().departamentoId);
      } else {
        setUser(null);
        setDepartamentoId(null);
      }
      // Cuando llegamos aquí quierque los datos ya están cargados, por eso seteamos a false el cargando
      setcargando(false);
    });

    return () => desuscribirse();
  }, []);

  return (
    <AuthContext.Provider value={{ user, departamentoId, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};
