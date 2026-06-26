# Revelado — Progreso (actualizado 26/06/2026)

## Estado general
**Todas las fases (A–G) construidas.** La app compila (build OK) y corre.
Falta solo: que pruebes cada feature con tu cuenta y completes `datos.txt`.

## ✅ Implementado
- **A — Scaffold:** Vite + Vue 3 + Tailwind v4 + cliente Supabase + `.env`.
- **B — Auth:** `useAuth` (login/register/logout/updatePassword/getCurrentUser),
  guard de rutas, vistas Login y Register, logout en el Header.
- **C — Feed:** leer posts con autor, crear post con imagen (Storage),
  feed en grilla + **Realtime**.
- **D — Editar/borrar:** solo posts propios (`PostCard` muestra los botones si sos
  el dueño) + **reveals con GSAP** al entrar el feed.
- **E — Comentarios:** por post, en **Realtime** (`Comments.vue`).
- **F — Perfiles:** ver el de cualquier usuario (`/usuario/:id`) + editar el propio
  (`/perfil`: nombre, bio, avatar, contraseña).
- **G — Pulido:** diseño "Revelado" (tokens `@theme` + fuentes), HTML semántico,
  a11y (labels, aria-live, foco visible), JSDoc, README, `datos.txt`.

## ⏳ Pendiente (tuyo)
1. **Completar `datos.txt`** (carrera, materia, cuatrimestre, año, turno, comisión).
2. **Probar cada feature** logueado: crear post con foto, comentar, editar, borrar,
   ver un perfil, editar tu perfil, cambiar contraseña.
3. (Opcional) ajustar detalles de diseño a tu gusto.

## Verificado por mí
- `npm run build` → OK (88 módulos, sin errores).
- Render real del feed logueado con el diseño aplicado, sin errores en consola.

## Cómo correr
`npm run dev` dentro del proyecto → `http://localhost:5173`.
