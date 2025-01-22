<template>
  <header class="cabecera">
    <h1>Lista de Tareas</h1>
    <p>
      Tienes <span class="resaltado">{{ pendientes }}</span> tareas pendientes 
      de un total de <span class="resaltado">{{ total }}</span>.
    </p>
  </header>
</template>

<script>
export default {
  name: "Cabecera",
  props: {
    pendientes: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
.cabecera {
  text-align: center;
  margin-bottom: 1rem;
  background-color: #f8f9fa; /* Fondo suave */
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2rem;
  margin: 0;
  color: #343a40; /* Tono más oscuro */
}

p {
  font-size: 1.2rem;
  margin: 0.5rem 0 0;
  color: #495057; /* Tono suave */
}

.resaltado {
  font-weight: bold;
  color: #007bff; /* Azul para destacar */
}
</style>
