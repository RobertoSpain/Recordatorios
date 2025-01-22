import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyABcde7nM8mLPxXcU0Yw_yvNG8kx_8sFqU",
  authDomain: "fbclaseprueba.firebaseapp.com",
  projectId: "fbclaseprueba",
  storageBucket: "fbclaseprueba.appspot.com", // Corregido el storageBucket
  messagingSenderId: "289227959964",
  appId: "1:289227959964:web:c8648867fb850880c2c759",
  measurementId: "G-KXHB67QBSN",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

// Inicializar Firebase Auth
export const auth = getAuth(app);

// Proveedor de autenticación para GitHub
const githubProvider = new GithubAuthProvider();

// Funciones de autenticación
/**
 * Registrar un nuevo usuario con correo y contraseña.
 * @param {string} email - El correo del usuario.
 * @param {string} password - La contraseña del usuario.
 */
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Iniciar sesión con correo y contraseña.
 * @param {string} email - El correo del usuario.
 * @param {string} password - La contraseña del usuario.
 */
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Cerrar la sesión del usuario actual.
 */
export const logoutUser = () => {
  return signOut(auth);
};

/**
 * Iniciar sesión con GitHub.
 * @returns {Promise<Object>} Usuario autenticado.
 */
export const loginWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential.accessToken; // Si necesitas el token de GitHub
    const user = result.user; // Usuario autenticado
    console.log("Inicio de sesión con GitHub exitoso:", user);
    return user;
  } catch (error) {
    console.error("Error al iniciar sesión con GitHub:", error);
    throw error;
  }
};

// Exportar la app Firebase
export const firebaseApp = app;
