import { supabase } from "./supabase";

/**
 * Sube un archivo a un bucket, en una carpeta propia del usuario,
 * y devuelve la URL pública. Reutilizable para posts y avatares.
 * @param {File} file - el archivo de imagen
 * @param {string} userId - id del usuario (define su carpeta)
 * @param {string} bucket - nombre del bucket ("posts" o "avatars")
 * @returns {Promise<string>} la URL pública de la imagen
 */
async function uploadImage(file, userId, bucket) {
    const extension = file.name.split(".").pop();
    const filePath = `${userId}/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase
        .storage
        .from(bucket)
        .upload(filePath, file);

    if (error) {
        throw new Error(error.message);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
}

/**
 * Sube la imagen de un post al bucket "posts".
 * @param {File} file
 * @param {string} userId
 * @returns {Promise<string>}
 */
export function uploadPostImage(file, userId) {
    return uploadImage(file, userId, "posts");
}

/**
 * Sube el avatar de un usuario al bucket "avatars".
 * @param {File} file
 * @param {string} userId
 * @returns {Promise<string>}
 */
export function uploadAvatar(file, userId) {
    return uploadImage(file, userId, "avatars");
}
