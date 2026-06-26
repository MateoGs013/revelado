<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchPosts, createPost, subscribeToNewPosts } from "../services/posts";
import { uploadPostImage } from "../services/storage";
import { useAuth } from "../services/useAuth";
import PostCard from "../components/PostCard.vue";

gsap.registerPlugin(ScrollTrigger);

const { user } = useAuth();

const posts = ref([]);
const loading = ref(true);
const errorMessage = ref("");

const newContent = ref("");
const imageFile = ref(null);
const creating = ref(false);
const createError = ref("");

const feedEl = ref(null);
let gsapCtx = null;
let unsubscribe = () => {};

async function loadPosts() {
    posts.value = await fetchPosts();
}

/** Reveal sutil de las publicaciones al entrar el feed en pantalla. */
function revealPosts() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsapCtx?.revert();
    gsapCtx = gsap.context(() => {
        gsap.from("[data-reveal]", {
            opacity: 0,
            y: 24,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            clearProps: "all",
            scrollTrigger: { trigger: feedEl.value, start: "top 85%", once: true },
        });
    }, feedEl.value);
}

onMounted(async () => {
    try {
        await loadPosts();
    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        loading.value = false;
    }
    await nextTick();
    revealPosts();
    // Realtime: el feed se actualiza solo cuando alguien publica.
    unsubscribe = subscribeToNewPosts(loadPosts);
});

onUnmounted(() => {
    unsubscribe();
    gsapCtx?.revert();
});

function handleFileChange(event) {
    imageFile.value = event.target.files[0] ?? null;
}

async function handleCreatePost() {
    creating.value = true;
    createError.value = "";
    try {
        let imageUrl = null;
        if (imageFile.value) {
            imageUrl = await uploadPostImage(imageFile.value, user.value.id);
        }
        await createPost({
            userId: user.value.id,
            content: newContent.value,
            imageUrl,
        });
        newContent.value = "";
        imageFile.value = null;
        // No hace falta recargar: el realtime trae el post nuevo solo.
    } catch (error) {
        createError.value = error.message;
    } finally {
        creating.value = false;
    }
}
</script>

<template>
  <main class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="font-display text-5xl text-ivory mb-1">Revelado</h1>
    <p class="font-mono text-xs uppercase tracking-[0.3em] text-ash mb-8">el cuarto oscuro</p>

    <!-- Crear publicación -->
    <form @submit.prevent="handleCreatePost" class="mb-10 border border-carbon rounded-lg p-4 bg-carbon/30">
      <label for="content" class="label">¿Qué estás revelando?</label>
      <textarea id="content" v-model="newContent" required rows="3" class="field mb-3"></textarea>

      <div class="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <label for="image" class="label">Foto (opcional)</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            @change="handleFileChange"
            class="block w-full font-mono text-xs text-ash file:mr-3 file:rounded file:border file:border-ash/40 file:bg-transparent file:text-ivory file:px-3 file:py-1.5 file:uppercase file:cursor-pointer hover:file:border-safelight"
          />
        </div>
        <button type="submit" class="btn-primary" :disabled="creating">
          {{ creating ? "Publicando…" : "Publicar" }}
        </button>
      </div>

      <p v-if="createError" role="alert" aria-live="assertive" class="text-safelight text-sm mt-2">
        {{ createError }}
      </p>
    </form>

    <!-- Estados del feed -->
    <p v-if="loading" class="font-mono text-sm text-ash">Cargando publicaciones…</p>
    <p v-else-if="errorMessage" role="alert" class="text-safelight">{{ errorMessage }}</p>
    <p v-else-if="posts.length === 0" class="font-mono text-sm text-ash">
      Todavía no hay publicaciones. Subí la primera.
    </p>

    <!-- Feed en grilla tipo masonry -->
    <div v-else ref="feedEl" class="columns-1 sm:columns-2 gap-4">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        :current-user-id="user?.id"
        data-reveal
        @changed="loadPosts"
      />
    </div>
  </main>
</template>
