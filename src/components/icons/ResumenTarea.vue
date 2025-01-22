<script>
export default {
  name: "ResumenTarea",
  props: {
    tareas: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      prioridades: ["High", "Normal", "Low"],
    };
  },
  methods: {
    cambiarEstado(tarea) {
      // Cambia el estado de completada y emite el evento para actualizar la tarea
      tarea.completada = !tarea.completada;
      this.$emit("actualizar-tareas", tarea);
    },
    cambiarPrioridad(tarea, nuevaPrioridad) {
      // Cambia la prioridad de la tarea y emite el evento para actualizar la tarea
      tarea.prioridad = nuevaPrioridad;
      this.$emit("actualizar-tareas", tarea);
    },
    borrarTarea(id) {
      // Verifica que el ID sea válido antes de emitir el evento
      if (!id || typeof id !== "string") {
        console.error("ID no válido al intentar borrar:", id);
        return;
      }
      console.log("Emitir evento para borrar tarea con ID:", id);
      this.$emit("borrar-tarea", id);
    },
  },
};
</script>

<template>
  <div class="lista-tareas">
    <!-- Mensaje cuando no hay tareas -->
    <div v-if="tareas.length === 0" class="mensaje">
      No hay tareas. ¡Añade una nueva!
    </div>

    <!-- Lista de tareas -->
    <transition-group name="fade" tag="ul">
      <li
        v-for="tarea in tareas"
        :key="tarea.id"
        :class="{ completada: tarea.completada }"
      >
        <span @click="cambiarEstado(tarea)" class="estado">
          {{ tarea.completada ? "✔" : "○" }}
        </span>
        <span class="texto">{{ tarea.texto }}</span>
        <span class="prioridad">[{{ tarea.prioridad }}]</span>
        <span class="fecha">Creada: {{ tarea.creadaEn }}</span>
        <div class="botones-prioridad">
          <button
            v-for="prioridad in prioridades"
            :key="prioridad"
            @click="cambiarPrioridad(tarea, prioridad)"
            :class="{ activo: tarea.prioridad === prioridad }"
          >
            {{ prioridad }}
          </button>
        </div>
        <!-- Botón para borrar tarea -->
        <button @click="borrarTarea(tarea.id)" class="borrar">🗑</button>
      </li>
    </transition-group>

    <!-- Botón para borrar todas las tareas completadas -->
    <button @click="$emit('borrar-completadas')" class="borrar-completadas">
      Borrar tareas completadas
    </button>
  </div>
</template>

<style scoped>
.lista-tareas {
  margin-top: 1rem;
}

.mensaje {
  text-align: center;
  font-size: 1.2rem;
  color: #888;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border: 1px solid #ccc;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

li.completada {
  text-decoration: line-through;
  color: #aaa;
}

.estado {
  cursor: pointer;
  font-size: 1.5rem;
}

.texto {
  flex: 1;
  margin: 0 0.5rem;
}

.prioridad {
  margin-right: 1rem;
  font-weight: bold;
}

.fecha {
  font-size: 0.8rem;
  color: #888;
  margin-left: 1rem;
}

.botones-prioridad {
  display: flex;
  gap: 0.3rem;
}

.botones-prioridad button {
  padding: 0.2rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: white;
  cursor: pointer;
  font-size: 0.9rem;
}

.botones-prioridad button.activo {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.botones-prioridad button:hover {
  background-color: #f0f0f0;
}

.borrar {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 1.2rem;
}

.borrar-completadas {
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: red;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}


</style>
