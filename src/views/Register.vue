<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../services/useAuth";

const router = useRouter();
const { register } = useAuth();

const email = ref("")
const password = ref("")
const displayName = ref("")
const errorMessage = ref("")
const loading = ref(false)

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
    <main>
        <h1>Registrar</h1>

        <form @submit.prevent="handleSubmit">

            <div>
                <label for="displayName">Nombre</label>
                <input type="text" id="displayName" v-model="displayName" required autocomplete="name" />
            </div>

            <div>
                <label for="email">Email</label>
                <input type="email" id="email" v-model="email" required autocomplete="email" />
            </div>

            <div>
                <label for="password">Contraseña</label>
                <input type="password" id="password" v-model="password" required autocomplete="current-password" />
            </div>

            <p v-if="errorMessage" role="alert" aria-live="assertive">
                {{ errorMessage }}
            </p>

            <button type="submit" :disabled="loading">
                {{ loading ? "Creando..." : "Crear cuenta" }}
            </button>
        </form>

        <p>
            ¿Ya tenés cuenta?
            <RouterLink to="/login">Ingresar</RouterLink>
        </p>
    </main>
</template>