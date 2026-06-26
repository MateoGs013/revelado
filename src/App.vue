<script setup>
import Header from "./components/Header.vue";
</script>

<template>
  <!-- Accesibilidad: saltar la navegación e ir directo al contenido con el teclado. -->
  <a href="#contenido" class="skip-link">Saltar al contenido</a>

  <Header />

  <div id="contenido">
    <RouterView />
  </div>

  <!-- pb extra en móvil para que la barra inferior no tape el footer. -->
  <footer class="border-t border-carbon mt-16 px-4 pt-8 pb-24 sm:pb-8 text-center font-mono text-xs text-ash">
    Revelado — cuarto oscuro · 2026
  </footer>
</template>
