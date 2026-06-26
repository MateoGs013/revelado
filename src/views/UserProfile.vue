<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { fetchProfile } from "../services/profiles";
import { fetchPostsByUser } from "../services/posts";
import { useAuth } from "../services/useAuth";
import PostCard from "../components/PostCard.vue";
import Avatar from "../components/Avatar.vue";

const route = useRoute();
const { user } = useAuth();

const profile = ref(null);
const posts = ref([]);
const loading = ref(true);
const errorMessage = ref("");

// Si el perfil que estoy mirando es el mío, muestro el atajo para editarlo.
const isOwnProfile = computed(() => user.value?.id === route.params.id);

async function load(id) {
    loading.value = true;
    errorMessage.value = "";
    try {
        profile.value = await fetchProfile(id);
        posts.value = await fetchPostsByUser(id);
    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        loading.value = false;
    }
}

onMounted(() => load(route.params.id));
// Si navegás de un perfil a otro sin desmontar la vista, recargamos.
watch(() => route.params.id, (id) => { if (id) load(id); });
</script>

<template>
  <main class="max-w-3xl mx-auto px-4 py-8">
    <p v-if="loading" class="font-mono text-sm text-ash">Cargando perfil…</p>
    <p v-else-if="errorMessage" role="alert" class="text-safelight">{{ errorMessage }}</p>

    <template v-else-if="profile">
      <header class="flex items-center gap-5 mb-10">
        <Avatar :url="profile.avatar_url" :name="profile.display_name" :size="80" />
        <div class="min-w-0">
          <h1 class="font-display text-4xl text-ivory truncate">{{ profile.display_name ?? "Sin nombre" }}</h1>
          <p class="font-mono text-xs uppercase tracking-widest text-ash mt-1">
            {{ posts.length }} {{ posts.length === 1 ? "publicación" : "publicaciones" }}
          </p>
          <p v-if="profile.bio" class="font-mono text-sm text-ash mt-2">{{ profile.bio }}</p>
          <RouterLink v-if="isOwnProfile" to="/perfil" class="btn-ghost mt-3">Editar perfil</RouterLink>
        </div>
      </header>

      <h2 class="font-mono text-xs uppercase tracking-widest text-ash mb-4">Publicaciones</h2>
      <p v-if="posts.length === 0" class="font-mono text-sm text-ash">Todavía no publicó nada.</p>
      <div v-else class="columns-1 sm:columns-2 gap-4">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          :current-user-id="user?.id"
          @changed="load(route.params.id)"
        />
      </div>
    </template>
  </main>
</template>
