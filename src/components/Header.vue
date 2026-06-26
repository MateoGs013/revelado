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
  <header class="border-b border-carbon sticky top-0 z-10 bg-noir/90 backdrop-blur">
    <nav class="max-w-3xl mx-auto flex items-center justify-between px-4 h-14">
      <RouterLink to="/" class="font-display text-2xl text-ivory">
        Revelado<span class="text-safelight">.</span>
      </RouterLink>

      <div class="flex items-center gap-4 font-mono text-xs uppercase tracking-wider">
        <template v-if="user">
          <RouterLink to="/perfil" class="text-ash hover:text-ivory">Mi perfil</RouterLink>
          <button type="button" @click="handleLogout" class="text-ash hover:text-safelight">
            Salir
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="text-ash hover:text-ivory">Ingresar</RouterLink>
          <RouterLink to="/register" class="text-ash hover:text-ivory">Crear cuenta</RouterLink>
        </template>
      </div>
    </nav>
  </header>
</template>
