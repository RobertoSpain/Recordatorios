<script>
import { ref } from "vue";
import {
  registerUser,
  loginUser,
  logoutUser,
  auth,
  loginWithGitHub, // Cambié el nombre al correcto
} from "../../firebase"; // Ajusta la ruta si es necesario
import { onAuthStateChanged } from "firebase/auth";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const user = ref(null);
    const isLoginMode = ref(true);

    // Escuchar cambios en el estado de autenticación
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;
      console.log("Estado de autenticación:", currentUser);
    });

    // Alternar entre login y registro
    const toggleMode = () => {
      isLoginMode.value = !isLoginMode.value;
    };

    // Manejar el inicio de sesión o registro con correo
    const handleSubmit = async () => {
      try {
        if (isLoginMode.value) {
          await loginUser(email.value, password.value);
          alert("Sesión iniciada correctamente");
        } else {
          await registerUser(email.value, password.value);
          alert("Usuario registrado correctamente");
        }
        email.value = "";
        password.value = "";
      } catch (error) {
        alert("Error: " + error.message);
      }
    };

    // Manejar el inicio de sesión con GitHub
    const handleGithubLogin = async () => {
      try {
        await loginWithGitHub();
        alert("Sesión iniciada con GitHub");
      } catch (error) {
        alert("Error al iniciar sesión con GitHub: " + error.message);
      }
    };

    // Cerrar sesión
    const logout = async () => {
      try {
        await logoutUser();
        alert("Sesión cerrada");
      } catch (error) {
        alert("Error al cerrar sesión: " + error.message);
      }
    };

    return {
      email,
      password,
      user,
      isLoginMode,
      toggleMode,
      handleSubmit,
      handleGithubLogin,
      logout,
    };
  },
};
</script>

<template>
  <div class="auth-container">
    <h2 v-if="!user">Acceso a la aplicación</h2>
    <form v-if="!user" @submit.prevent="handleSubmit">
      <input
        type="email"
        v-model="email"
        placeholder="Correo electrónico"
        required
      />
      <input
        type="password"
        v-model="password"
        placeholder="Contraseña"
        required
      />
      <button type="submit">
        {{ isLoginMode ? "Iniciar sesión" : "Registrarse" }}
      </button>
    </form>
    <p v-if="!user">
      <span @click="toggleMode">
        {{ isLoginMode
          ? "¿No tienes cuenta? Regístrate"
          : "¿Ya tienes cuenta? Inicia sesión" }}
      </span>
    </p>

    <!-- Botón para iniciar sesión con GitHub -->
    <button v-if="!user" @click="handleGithubLogin">
      Iniciar sesión con GitHub
    </button>

    <!-- Mensaje de bienvenida y botón para cerrar sesión -->
    <div v-else>
      <h3>¡Bienvenido, {{ user.email }}!</h3>
      <button @click="logout">Cerrar sesión</button>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  background: var(--card-background);
  border-radius: var(--border-radius);
  text-align: center;
}
input {
  display: block;
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--text-muted);
}
button {
  padding: 0.5rem 1rem;
  border: none;
  background: var(--primary-green);
  color: var(--text-color);
  cursor: pointer;
  border-radius: var(--border-radius);
  transition: background-color var(--transition-time);
}
button:hover {
  background: var(--primary-green-light);
}
span {
  color: var(--primary-green);
  cursor: pointer;
  text-decoration: underline;
}
</style>
