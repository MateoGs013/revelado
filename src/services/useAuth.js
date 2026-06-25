import { ref } from "vue";
import { supabase } from "./supabase";

/* Estado del usuario autenticado */
const user = ref(null);

/* Escucha los cambios en el estado de autenticación */
supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user ?? null;
});

export function useAuth() {

    /**
     * 
     * @param { string } email 
     * @param { string } password 
     */
    async function login(email, password) {
        const { error } = await supabase.auth.signInWithPassword({ 
            email, 
            password 
        });
        if (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Cierra la sesion del usuario
     */
    async function logout () {
        const { error } = await supabase.auth.signOut()
        if (error) {
            throw new Error(error.message)
        }
    }

    /**
     * 
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

    return {
        user,
        login,
        logout,
        register,
    }
}