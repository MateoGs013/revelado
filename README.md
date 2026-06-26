# Revelado

Red social para fotógrafos, construida como SPA con Vue 3 y Supabase.
La idea estética es un "cuarto oscuro" digital: la foto es la protagonista
y la interfaz casi desaparece.

## Funcionalidades

- Autenticación con email y contraseña (registro, login, logout).
- Guard de rutas: rutas privadas y redirección de invitados.
- Feed con las publicaciones de todos los usuarios (columna, estilo red social).
- Crear publicaciones con texto y una imagen (subida a Storage).
- Editar y eliminar únicamente las publicaciones propias.
- Comentarios por publicación.
- Tiempo real (Realtime): el feed y los comentarios se actualizan solos.
- Explorar: una grilla con todas las fotos publicadas.
- Perfiles: ver el de cualquier usuario (sus datos + sus publicaciones).
- Editar el perfil propio: nombre, biografía, avatar (con vista previa) y contraseña.
- Navegación tipo app: barra superior y barra inferior en mobile.
- Avatares con inicial de respaldo y fechas relativas ("hace 2 h").
- Creación automática del perfil al registrarse (mediante un trigger de la base).

## Tecnologías

- Vue 3 (Composition API, `<script setup>`)
- Vite
- Vue Router 4 (ruteo SPA, history mode)
- Tailwind CSS v4 (tokens con `@theme`)
- Supabase (Auth, Postgres, Storage, Realtime)
- GSAP (animaciones sutiles)

## Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/MateoGs013/revelado.git
cd revelado

# 2. Instalar dependencias
npm install

# 3. Crear el archivo .env (ver la sección de abajo)

# 4. Levantar el servidor de desarrollo
npm run dev
```

Después abrí el navegador en la URL que muestra la terminal (por defecto
`http://localhost:5173`).

## Variables de entorno

Creá un archivo `.env` en la raíz del proyecto con estos valores:

```env
VITE_SUPABASE_URL=https://usvhmlerifmruwuouruk.supabase.co
VITE_SUPABASE_KEY=sb_publishable_siOseIR-hzvrwNwvLRufYA__CXuvKd8
```

La `VITE_SUPABASE_KEY` es una clave **publishable** (anon): está pensada para usarse
en el navegador y está protegida por las políticas RLS de Supabase, por eso es seguro
compartirla en este README.

## Estructura del proyecto

```
src/
├─ services/        # cliente de Supabase + lógica de datos
│  ├─ supabase.js     # cliente único de Supabase
│  ├─ useAuth.js      # sesión + login / register / logout / password
│  ├─ posts.js        # leer / crear / editar / borrar / realtime de posts
│  ├─ comments.js     # leer / crear / realtime de comentarios
│  ├─ profiles.js     # leer y actualizar perfiles
│  └─ storage.js      # subida de imágenes (posts y avatares)
├─ components/
│  ├─ Header.vue      # navegación (barra superior + barra inferior en mobile)
│  ├─ Avatar.vue      # avatar con foto o inicial de respaldo
│  ├─ PostCard.vue    # una publicación (autor, imagen, editar/borrar, comentarios)
│  └─ Comments.vue    # comentarios de un post, en tiempo real
├─ views/
│  ├─ Home.vue        # feed + crear publicación
│  ├─ Explore.vue     # grilla con todas las fotos
│  ├─ Login.vue       # ingresar
│  ├─ Register.vue    # crear cuenta
│  ├─ UserProfile.vue # perfil de un usuario + sus posts
│  └─ EditProfile.vue # editar nombre / bio / avatar / contraseña
├─ utils/
│  └─ date.js         # formato de fechas (relativo y absoluto)
├─ router/router.js   # rutas + guard de autenticación
├─ App.vue            # layout raíz
├─ main.js            # punto de entrada
└─ style.css          # tokens de diseño (@theme) + estilos base
```

## Scripts

- `npm run dev` — servidor de desarrollo.
- `npm run build` — build de producción.
- `npm run preview` — previsualizar el build de producción.
