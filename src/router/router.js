import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import UserProfile from "../views/UserProfile.vue";
import EditProfile from "../views/EditProfile.vue";
import { useAuth } from "../services/useAuth.js";

const routes = [
    { path: "/", component: Home, meta: { requireAuth: true } },
    { path: "/login", component: Login, meta: { requireGuest: true } },
    { path: "/register", component: Register, meta: { requireGuest: true } },
    { path: "/perfil", component: EditProfile, meta: { requireAuth: true } },
    { path: "/usuario/:id", component: UserProfile, meta: { requireAuth: true } },
];

const router = createRouter({
    routes,
    history: createWebHistory(),
});

const { getCurrentUser } = useAuth();

// Portero: corre antes de cada navegación.
router.beforeEach(async (to) => {
    const currentUser = await getCurrentUser();

    // Ruta privada y sin sesión -> al login.
    if (to.meta.requireAuth && !currentUser) {
        return "/login";
    }
    // Ruta solo para invitados y con sesión -> al home.
    if (to.meta.requireGuest && currentUser) {
        return "/";
    }
});

export default router;
