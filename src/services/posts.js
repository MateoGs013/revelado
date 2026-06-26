import { supabase } from "./supabase";

/**
 * Trae todas las publicaciones (la más nueva primero) con los datos del autor.
 * @returns {Promise<object[]>}
 */
export async function fetchPosts() {
    const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(display_name, avatar_url)")
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

/**
 * Trae las publicaciones de un usuario puntual (la más nueva primero).
 * @param {string} userId
 * @returns {Promise<object[]>}
 */
export async function fetchPostsByUser(userId) {
    const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(display_name, avatar_url)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

/**
 * Crea una nueva publicación.
 * @param {{ userId: string, content: string, imageUrl?: string|null }} data
 */
export async function createPost({ userId, content, imageUrl = null }) {
    const { error } = await supabase
        .from("posts")
        .insert({
            user_id: userId,
            content,
            image_url: imageUrl,
        });

    if (error) {
        throw new Error(error.message);
    }
}

/**
 * Edita el contenido de una publicación propia.
 * La RLS de la base garantiza que solo puedas editar las tuyas.
 * @param {string} postId
 * @param {{ content: string }} data
 */
export async function updatePost(postId, { content }) {
    const { error } = await supabase
        .from("posts")
        .update({ content })
        .eq("id", postId);

    if (error) {
        throw new Error(error.message);
    }
}

/**
 * Elimina una publicación propia (la RLS valida que sea tuya).
 * @param {string} postId
 */
export async function deletePost(postId) {
    const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

    if (error) {
        throw new Error(error.message);
    }
}

/**
 * Se suscribe en tiempo real a las nuevas publicaciones.
 * Ejecuta el callback cada vez que se inserta un post.
 * @param {() => void} callback
 * @returns {() => void} función para cancelar la suscripción
 */
export function subscribeToNewPosts(callback) {
    const channel = supabase
        .channel("posts")
        .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "posts" },
            () => callback()
        )
        .subscribe();

    return () => channel.unsubscribe();
}
