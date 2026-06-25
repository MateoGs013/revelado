# Revelado 🎞️

Red social para fotógrafos, construida como SPA con Vue 3 y Supabase.
La idea estética: un "cuarto oscuro" digital donde la foto es la protagonista.

> ⚠️ Proyecto en desarrollo (entrega académica). Por ahora está implementada la
> autenticación; el resto de las funcionalidades están en construcción.

## ✨ Funcionalidades

**Implementadas:**
- Registro de usuarios con email y contraseña (Supabase Auth).
- Inicio y cierre de sesión.
- Estado de sesión reactivo y persistente (composable `useAuth`).
- Creación automática del perfil al registrarse (mediante un *trigger* de la base).

**En desarrollo:**
- Guard de rutas (proteger rutas privadas y redirigir invitados).
- Feed de publicaciones en tiempo real (Realtime).
- Crear / editar / eliminar publicaciones con imagen (Storage).
- Comentarios en tiempo real.
- Perfiles de usuario.

## 🛠️ Tecnologías

- **Vue 3** (Composition API, `<script setup>`)
- **Vite** (bundler)
- **Vue Router 4** (ruteo SPA, history mode)
- **Tailwind CSS v4**
- **Supabase** (Auth, Postgres, Storage, Realtime)

## 📦 Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd sonzogni-mateo

# 2. Instalar dependencias
npm install

# 3. Crear el archivo .env (ver la sección de abajo)

# 4. Levantar el servidor de desarrollo
npm run dev
```

Después abrí el navegador en la URL que muestra la terminal (por defecto
`http://localhost:5173`).

## 🔑 Variables de entorno

Creá un archivo `.env` en la raíz del proyecto con estos valores:

```env
VITE_SUPABASE_URL=https://usvhmlerifmruwuouruk.supabase.co
VITE_SUPABASE_KEY=sb_publishable_siOseIR-hzvrwNwvLRufYA__CXuvKd8
```

> La `VITE_SUPABASE_KEY` es una clave **publishable** (anon): está pensada para
> usarse en el navegador y está protegida por las políticas RLS de Supabase, por
> eso es seguro compartirla en este README.

## 📁 Estructura del proyecto

```
src/
├─ services/        # cliente de Supabase + lógica reutilizable (composables)
│  ├─ supabase.js     # cliente único de Supabase
│  └─ useAuth.js      # estado de sesión + login / register / logout
├─ router/          # configuración de rutas (Vue Router)
├─ views/           # pantallas (Home, Login, Register)
├─ components/      # componentes reutilizables
├─ App.vue          # layout raíz
└─ main.js          # punto de entrada de la app
```

## 📜 Scripts

- `npm run dev` — servidor de desarrollo.
- `npm run build` — build de producción.
- `npm run preview` — previsualizar el build de producción.
