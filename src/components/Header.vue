<script setup>
import { useRouter } from "vue-router";
import { useAuth } from "../services/useAuth";

const router = useRouter();
const { user, logout } = useAuth();

async function handleLogout() {
    try {
        await logout();
        router.push("/login");
    } catch (error) {
        console.error(error);
    }
}
</script>

<template>
  <!-- Barra superior: marca + secciones -->
  <header class="border-b border-carbon sticky top-0 z-20 bg-noir/90 backdrop-blur">
    <nav class="max-w-5xl mx-auto flex items-center justify-between px-4 h-14" aria-label="Navegación principal">
      <RouterLink to="/" class="font-display text-2xl text-ivory">
        Revelado<span class="text-safelight">.</span>
      </RouterLink>

      <div class="flex items-center gap-5 font-mono text-xs uppercase tracking-wider">
        <template v-if="user">
          <!-- Secciones (texto): desde tablet para arriba; en móvil van abajo -->
          <RouterLink to="/" class="hidden sm:inline text-ash hover:text-ivory transition-colors" exact-active-class="text-safelight">
            Inicio
          </RouterLink>
          <RouterLink to="/explorar" class="hidden sm:inline text-ash hover:text-ivory transition-colors" active-class="text-safelight">
            Explorar
          </RouterLink>
          <RouterLink to="/perfil" class="text-ash hover:text-ivory transition-colors" active-class="text-safelight">
            Mi perfil
          </RouterLink>
          <button type="button" @click="handleLogout" class="text-ash hover:text-safelight transition-colors">
            Salir
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="text-ash hover:text-ivory transition-colors">Ingresar</RouterLink>
          <RouterLink to="/register" class="text-ash hover:text-ivory transition-colors">Crear cuenta</RouterLink>
        </template>
      </div>
    </nav>
  </header>

  <!-- Barra inferior tipo app: solo en móvil y solo con sesión iniciada -->
  <nav
    v-if="user"
    aria-label="Navegación inferior"
    class="sm:hidden fixed bottom-0 inset-x-0 z-20 border-t border-carbon bg-noir/95 backdrop-blur
           grid grid-cols-3 font-mono text-[0.6rem] uppercase tracking-wider"
  >
    <RouterLink to="/" class="flex flex-col items-center gap-1 py-2.5 text-ash" exact-active-class="text-safelight">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" />
      </svg>
      Inicio
    </RouterLink>
    <RouterLink to="/explorar" class="flex flex-col items-center gap-1 py-2.5 text-ash" active-class="text-safelight">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
      </svg>
      Explorar
    </RouterLink>
    <RouterLink to="/perfil" class="flex flex-col items-center gap-1 py-2.5 text-ash" active-class="text-safelight">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
      </svg>
      Perfil
    </RouterLink>
  </nav>
</template>
