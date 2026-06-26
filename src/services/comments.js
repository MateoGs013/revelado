import { supabase } from "./supabase";

/**
 * Trae los comentarios de una publicación (del más viejo al más nuevo)
 * con los datos del autor.
 * @param {string} postId
 * @returns {Promise<object[]>}
 */
export async function fetchComments(postId) {
    const { data, error } = await supabase
        .from("comments")
        .select("*, profiles(display_name, avatar_url)")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

/**
 * Crea un comentario en una publicación.
 * @param {{ postId: string, userId: string, content: string }} data
 */
export async function createComment({ postId, userId, content }) {
    const { error } = await supabase
        .from("comments")
        .insert({
            post_id: postId,
            user_id: userId,
            content,
        });

    if (error) {
        throw new Error(error.message);
    }
}

/**
 * Se suscribe en tiempo real a los comentarios nuevos de UNA publicación.
 * El "filter" hace que solo lleguen los comentarios de ese post.
 * @param {string} postId
 * @param {() => void} callback
 * @returns {() => void} función para cancelar la suscripción
 */
export function subscribeToNewComments(postId, callback) {
    const channel = supabase
        .channel(`comments:${postId}`)
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "comments",
                filter: `post_id=eq.${postId}`,
            },
            () => callback()
        )
        .subscribe();

    return () => channel.unsubscribe();
}
