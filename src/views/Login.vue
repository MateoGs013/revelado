<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../services/useAuth";

const router = useRouter();
const { login } = useAuth();

const email = ref("")
const password = ref("")
const errorMessage = ref("")
const loading = ref(false)

async function handleSubmit() {
    loading.value = true;
    errorMessage.value = "";
    try {
        await login(email.value, password.value);
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
        <h1>Ingresar</h1>

        <form @submit.prevent="handleSubmit">
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
                {{ loading ? "Ingresando..." : "Ingresar" }}
            </button>
        </form>

        <p>
            ¿No tenés cuenta?
            <RouterLink to="/register">Crear cuenta</RouterLink>
        </p>
    </main>
</template>