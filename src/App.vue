<script>
import { ref, computed, onUnmounted } from "vue";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import Cabecera from "./components/icons/Cabecera.vue";
import Tarea from "./components/icons/Tarea.vue";
import ResumenTarea from "./components/icons/ResumenTarea.vue";
import Auth from './components/icons/Auth.vue';


export default {
  components: {
    Cabecera,
    Tarea,
    ResumenTarea,
    Auth,
  },
  setup() {
    const user = ref(null);
    const tareas = ref([]);
    const tareasCollection = collection(db, "recordatorios");
    let unsubscribe = null; // Variable para almacenar el listener

    // Escuchar cambios de autenticación
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;

      if (currentUser) {
        console.log(`Usuario autenticado: ${currentUser.email}`);

        // Configurar listener de Firestore
        unsubscribe = onSnapshot(
          tareasCollection,
          (snapshot) => {
            tareas.value = snapshot.docs
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
              .filter((tarea) => tarea.uid === currentUser.uid); // Filtrar por usuario
            console.log("Tareas sincronizadas desde Firebase:", tareas.value);
          },
          (error) => {
            console.error("Error al sincronizar las tareas desde Firebase:", error);
          }
        );
      } else {
        console.log("Usuario no autenticado. Limpiando tareas.");
        tareas.value = [];
      }
    });

    // Limpiar el listener cuando se desmonte el componente
    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe();
        console.log("Listener de Firestore desmontado.");
      }
    });

    // Añadir nueva tarea
    const añadirTarea = async (nuevaTarea) => {
      if (!auth.currentUser) return;
      try {
        const docRef = await addDoc(tareasCollection, {
          ...nuevaTarea,
          uid: auth.currentUser.uid,
          creadaEn: new Date().toISOString(),
        });
        console.log("Tarea añadida correctamente con ID:", docRef.id);
      } catch (error) {
        console.error("Error al añadir la tarea:", error);
      }
    };

    // Actualizar tarea existente
    const actualizarTareas = async (tareaActualizada) => {
      const tareaRef = doc(db, "recordatorios", tareaActualizada.id);
      try {
        await updateDoc(tareaRef, tareaActualizada);
        console.log(`Tarea actualizada: ${tareaActualizada.id}`);
      } catch (error) {
        console.error("Error al actualizar la tarea:", error);
      }
    };

    // Borrar una tarea por ID
    const borrarTarea = async (id) => {
      console.log("Intentando borrar tarea con ID:", id);

      if (!id) {
        console.error("No se puede borrar una tarea sin un ID válido.");
        return;
      }

      try {
        const tareaRef = doc(db, "recordatorios", id);
        await deleteDoc(tareaRef);
        console.log(`Tarea con ID ${id} eliminada de Firebase.`);
      } catch (error) {
        console.error("Error al borrar la tarea en Firebase:", error);
      }
    };

    const borrarCompletadas = async () => {
  const tareasCompletadas = tareas.value.filter((tarea) => tarea.completada);
  console.log("Tareas completadas para borrar:", tareasCompletadas);

  try {
    for (const tarea of tareasCompletadas) {
      if (!tarea.id) {
        console.error("Tarea sin ID encontrada al intentar borrar:", tarea);
        continue; 
      }

      const tareaRef = doc(db, "recordatorios", tarea.id);
      await deleteDoc(tareaRef);
      console.log(`Tarea completada con ID ${tarea.id} eliminada.`);
    }
  } catch (error) {
    console.error("Error al borrar tareas completadas:", error);
  }
};


    // Ordenar tareas por prioridad
    const tareasOrdenadas = computed(() => {
      const prioridadValor = { High: 3, Normal: 2, Low: 1 };
      return tareas.value.slice().sort((a, b) => prioridadValor[b.prioridad] - prioridadValor[a.prioridad]);
    });

    // Contar tareas pendientes
    const tareasPendientes = computed(() => {
      return tareas.value.filter((tarea) => !tarea.completada).length;
    });

    return {
      user,
      tareasOrdenadas,
      añadirTarea,
      actualizarTareas,
      borrarTarea,
      borrarCompletadas,
      tareasPendientes,
    };
  },
};
</script>

<template>
  <div id="app">
    <Auth />
    <div v-if="user">
      <Cabecera :pendientes="tareasPendientes" :total="tareasOrdenadas.length" />
      <Tarea @nueva-tarea="añadirTarea" />
      <ResumenTarea
        :tareas="tareasOrdenadas"
        @actualizar-tareas="actualizarTareas"
        @borrar-tarea="borrarTarea"
        @borrar-completadas="borrarCompletadas"
      />
    </div>
    <div v-else>
      <p>Inicia sesión para gestionar tus tareas.</p>
    </div>
  </div>
</template>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  margin: 0 auto;
  padding: 1rem;
  max-width: 800px;
}
</style>
