import { ref } from "vue";
import { supabase } from "./supabase";

/* Estado del usuario autenticado, compartido por toda la app. */
const user = ref(null);

/* "Alarma": mantiene el estado al día cada vez que cambia el login. */
supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user ?? null;
});

export function useAuth() {

    /**
     * Inicia sesión con email y contraseña.
     * @param {string} email
     * @param {string} password
     */
    async function login(email, password) {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            throw new Error(error.message);
        }
    }

    /** Cierra la sesión del usuario actual. */
    async function logout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Registra un usuario nuevo. El display_name viaja en options.data
     * para que el trigger de la base cree el profile automáticamente.
     * @param {string} email
     * @param {string} password
     * @param {string} displayName
     */
    async function register(email, password, displayName) {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: displayName,
                },
            },
        });
        if (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Cambia la contraseña del usuario logueado.
     * @param {string} newPassword
     */
    async function updatePassword(newPassword) {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Devuelve el usuario de la sesión actual, o null.
     * Lee la sesión guardada, por eso es fiable incluso al recargar la página.
     * @returns {Promise<object|null>}
     */
    async function getCurrentUser() {
        const { data } = await supabase.auth.getSession();
        return data.session?.user ?? null;
    }

    return {
        user,
        login,
        logout,
        register,
        updatePassword,
        getCurrentUser,
    };
}
