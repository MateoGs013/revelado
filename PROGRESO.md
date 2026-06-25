# Revelado — Progreso (actualizado 25/06/2026)

> Nota personal de avance para retomar. No es un entregable (los entregables
> son `README.md` y `datos.txt`). Podés borrarlo antes de la entrega final.

## Estado general
**Fase B (Auth) casi terminada.** Falta el guard de rutas.

---

## ✅ Hecho

### Fase A — Scaffold
- Vite + Vue 3 (Composition API, `<script setup>`) + Tailwind v4 (`@tailwindcss/vite`).
- Cliente de Supabase en `src/services/supabase.js` (export `supabase`).
- Credenciales en `.env`: `VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY`.

### Fase B — Auth (parcial)
- **`src/services/useAuth.js`** (composable) — COMPLETO:
  - `user` → `ref` a nivel módulo = estado compartido por toda la app.
  - `onAuthStateChange` ("la alarma") mantiene `user` actualizado solo.
  - Acciones: `login(email, password)`, `register(email, password, displayName)`, `logout()`.
  - Las funciones lanzan `throw` si Supabase devuelve error (la vista decide el mensaje).
- **`src/router/router.js`** — rutas: `/` (Home), `/login`, `/register`.
- **`src/views/Login.vue`** — form + `useAuth().login` + error con `aria-live` + `loading` + redirect a `/`.
- **`src/views/Register.vue`** — form + campo `displayName` + `useAuth().register`.
  El **trigger** de la base crea la fila en `profiles` solo (mandamos `display_name` en `options.data`; NO insertamos a mano).
- **Verificado:** el registro crea el usuario + su fila en `profiles`; el login con
  credenciales falsas muestra el mensaje de error.

---

## ⏳ Pendiente

### 👉 Para retomar PRIMERO — el GUARD (cierra la Fase B)
1. Marcar las rutas con `meta`:
   - `/` (privada) → `meta: { requiresAuth: true }`.
   - `/login` y `/register` (solo invitados) → `meta: { requiresGuest: true }`.
2. `router.beforeEach(async (to) => { ... })`:
   - ruta privada + sin sesión → redirigir a `/login`.
   - ya logueado + va a `/login` o `/register` → redirigir a `/`.
3. ⚠️ **Detalle clave a entender:** para el guard hay que chequear la sesión con
   `await supabase.auth.getSession()` (o una función `getCurrentUser()` en `useAuth`),
   **no solo el `user` reactivo**. Motivo: al **recargar** la página, el `user`
   reactivo puede estar un instante en `null` (la "alarma" todavía no cargó la sesión)
   y bouncearía a un usuario que SÍ está logueado. `getSession()` lee la sesión
   guardada de forma fiable.
4. Falta un **botón de logout** en la UI (en `App.vue` / nav) para cerrar sesión y
   poder probar el guard como invitado.

### Próximas fases
- **C — Feed:** leer posts de todos, grilla, crear post, subir imagen a Storage, realtime.
- **D —** editar/eliminar posts propios + reveals con GSAP.
- **E —** comentarios con realtime.
- **F —** perfiles (ver cualquiera + editar el propio: nombre / password / avatar).
- **G — Pulido:** HTML semántico, a11y, JSDoc, `README.md`, `datos.txt`.
  **Y sumar el diseño "Revelado"** (tokens de color + fuentes Instrument Serif / Space Mono)
  que revertimos al principio — ahora la UI está sin estilos a propósito.

### Limpieza menor
- `src/components/HelloWorld.vue` quedó sin uso (App.vue ahora usa `<RouterView />`).
  Se puede borrar.

---

## Convenciones del proyecto (mantener para coherencia)
- Estructura: `services/` (composables + cliente), `router/`, `views/`. (No usamos `lib/` + `composables/`).
- Composition API + `<script setup>`.
- Toda la lógica de datos vive en `services/` y lanza `throw`; las vistas deciden el mensaje (try/catch).
- Estado de auth compartido = `ref` a nivel módulo, expuesto por `useAuth()`.
- `.env`: la clave se llama `VITE_SUPABASE_KEY` (no `..._ANON_KEY`).
- Nombres: funciones/variables en `camelCase`; componentes/vistas en `PascalCase`.

---

## Cómo retomar mañana
1. Abrir terminal en `sonzogni-mateo` y correr `npm run dev`.
2. Decirle a Claude: **"dale con el guard"**.
