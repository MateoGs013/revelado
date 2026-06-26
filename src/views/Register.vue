<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../services/useAuth";

const router = useRouter();
const { register } = useAuth();

const email = ref("");
const password = ref("");
const displayName = ref("");
const errorMessage = ref("");
const loading = ref(false);

async function handleSubmit() {
    loading.value = true;
    errorMessage.value = "";
    try {
        await register(email.value, password.value, displayName.value);
        router.push("/");
    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        loading.value = false;
    }
}
</script>

<template>
  <main class="max-w-sm mx-auto px-4 py-16">
    <h1 class="font-display text-4xl text-ivory mb-1">Crear cuenta</h1>
    <p class="font-mono text-xs uppercase tracking-[0.3em] text-ash mb-8">sumate al cuarto oscuro</p>

    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div>
        <label for="displayName" class="label">Nombre</label>
        <input type="text" id="displayName" v-model="displayName" required autocomplete="name" class="field" />
      </div>

      <div>
        <label for="email" class="label">Email</label>
        <input type="email" id="email" v-model="email" required autocomplete="email" class="field" />
      </div>

      <div>
        <label for="password" class="label">Contraseña</label>
        <input type="password" id="password" v-model="password" required autocomplete="new-password" minlength="6" class="field" />
      </div>

      <p v-if="errorMessage" role="alert" aria-live="assertive" class="text-safelight text-sm">
        {{ errorMessage }}
      </p>

      <button type="submit" class="btn-primary" :disabled="loading">
        {{ loading ? "Creando…" : "Crear cuenta" }}
      </button>
    </form>

    <p class="font-mono text-xs text-ash mt-6">
      ¿Ya tenés cuenta?
      <RouterLink to="/login" class="text-safelight">Ingresar</RouterLink>
    </p>
  </main>
</template>
