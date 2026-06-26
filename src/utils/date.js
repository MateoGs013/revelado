/*
  Helpers de fecha para mostrar la metadata de los posts y comentarios.
  Se centralizan acá para no repetir la misma lógica en cada componente.
*/

/**
 * Formatea una fecha ISO como "26 jun 2026".
 * @param {string} iso - fecha ISO (created_at).
 * @returns {string}
 */
export function formatDate(iso) {
    return new Date(iso).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

/**
 * Devuelve el tiempo transcurrido en formato corto y humano, estilo red social:
 * "hace un momento", "hace 5 min", "hace 3 h", "hace 2 d".
 * Para más de una semana cae a la fecha absoluta (formatDate).
 * @param {string} iso - fecha ISO (created_at).
 * @returns {string}
 */
export function formatRelative(iso) {
    const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);

    if (seconds < 60) return "hace un momento";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `hace ${minutes} min`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours} h`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `hace ${days} d`;

    return formatDate(iso);
}
