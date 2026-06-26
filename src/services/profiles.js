import { supabase } from "./supabase";

/**
 * Trae el perfil de un usuario por su id.
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function fetchProfile(id) {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

/**
 * Actualiza el perfil propio (la RLS valida que sea el tuyo).
 * @param {string} id
 * @param {{ display_name?: string, avatar_url?: string }} data
 */
export async function updateProfile(id, data) {
    const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
}
