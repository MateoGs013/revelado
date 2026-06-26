<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { fetchPosts, subscribeToNewPosts } from "../services/posts";

/*
  Explorar: una grilla tipo galería con todas las fotos publicadas.
  Reutiliza el mismo fetchPosts del feed; acá solo mostramos los posts CON imagen.
*/
const posts = ref([]);
const loading = ref(true);
const errorMessage = ref("");
let unsubscribe = () => {};

// De todos los posts, los que tienen foto (la galería es solo visual).
const withImages = computed(() => posts.value.filter((post) => post.image_url));

async function load() {
    posts.value = await fetchPosts();
}

onMounted(async () => {
    try {
        await load();
    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        loading.value = false;
    }
    // Realtime: si alguien sube una foto nueva, aparece en la galería sola.
    unsubscribe = subscribeToNewPosts(load);
});

onUnmounted(() => unsubscribe());
</script>

<template>
  <main class="max-w-5xl mx-auto px-4 py-8">
    <h1 class="font-display text-4xl text-ivory mb-1">Explorar</h1>
    <p class="font-mono text-xs uppercase tracking-[0.3em] text-ash mb-8">todas las fotos</p>

    <p v-if="loading" class="font-mono text-sm text-ash">Cargando…</p>
    <p v-else-if="errorMessage" role="alert" class="text-safelight">{{ errorMessage }}</p>
    <p v-else-if="withImages.length === 0" class="font-mono text-sm text-ash">
      Todavía no hay fotos para explorar.
    </p>

    <ul v-else class="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2">
      <li v-for="post in withImages" :key="post.id" class="aspect-square overflow-hidden rounded">
        <RouterLink
          :to="`/usuario/${post.user_id}`"
          class="block w-full h-full"
          :aria-label="`Ver el perfil de ${post.profiles?.display_name ?? 'un usuario'}`"
        >
          <img
            :src="post.image_url"
            :alt="`Foto de ${post.profiles?.display_name ?? 'un usuario'}`"
            loading="lazy"
            class="w-full h-full object-cover transition-opacity hover:opacity-80"
          />
        </RouterLink>
      </li>
    </ul>
  </main>
</template>
