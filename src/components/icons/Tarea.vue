<script>
export default {
  name: "Tarea",
  data() {
    return {
      texto: "",
      prioridad: "Normal",
      bloqueado: false, // Bloqueo temporal para evitar duplicados
    };
  },
  methods: {
    crearTarea() {
      // Validar entrada
      if (this.texto.trim() === "") {
        alert("Por favor, escribe una tarea antes de añadirla.");
        return;
      }

      // Bloqueo temporal para evitar múltiples envíos
      if (this.bloqueado) return;
      this.bloqueado = true;
      setTimeout(() => {
        this.bloqueado = false; // Reactivar después de 1 segundo
      }, 1000);

      // Crear la nueva tarea (sin ID local)
      const nuevaTarea = {
        texto: this.texto.trim(), // Remover espacios en blanco innecesarios
        prioridad: this.prioridad,
        completada: false,
        creadaEn: new Date().toLocaleString(), // Fecha de creación
      };

      console.log("Creando tarea:", nuevaTarea);

      // Emitir el evento con la nueva tarea
      this.$emit("nueva-tarea", nuevaTarea);

      // Limpiar el formulario
      this.texto = "";
      this.prioridad = "Normal";
    },
  },
};
</script>

<template>
  <div class="tarea">
    <!-- Campo de entrada de texto -->
    <input
      type="text"
      v-model="texto"
      placeholder="Escribe una nueva tarea y presiona Enter"
      @keyup.enter="crearTarea"
    />

    <!-- Selector de prioridad -->
    <select v-model="prioridad">
      <option value="Low">Low</option>
      <option value="Normal">Normal</option>
      <option value="High">High</option>
    </select>

    <!-- Botón para añadir tarea -->
    <button @click="crearTarea">Añadir</button>
  </div>
</template>

<style scoped>
.tarea {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  align-items: center;
}

input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #0056b3;
}
</style>
