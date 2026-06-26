<script setup>
import { ref, computed } from "vue";
import { updatePost, deletePost } from "../services/posts";
import { formatDate, formatRelative } from "../utils/date";
import Avatar from "./Avatar.vue";
import Comments from "./Comments.vue";

const props = defineProps({
    post: { type: Object, required: true },
    currentUserId: { type: String, default: null },
});
const emit = defineEmits(["changed"]);

// Las acciones de editar/borrar solo aparecen si el post es del usuario actual.
const isOwner = computed(() => props.post.user_id === props.currentUserId);

const editing = ref(false);
const editContent = ref(props.post.content);
const busy = ref(false);
const errorMessage = ref("");

function startEdit() {
    editContent.value = props.post.content;
    editing.value = true;
}

async function handleSave() {
    busy.value = true;
    errorMessage.value = "";
    try {
        await updatePost(props.post.id, { content: editContent.value });
        editing.value = false;
        emit("changed");
    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        busy.value = false;
    }
}

async function handleDelete() {
    if (!confirm("¿Eliminar esta publicación?")) return;
    busy.value = true;
    errorMessage.value = "";
    try {
        await deletePost(props.post.id);
        emit("changed");
    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        busy.value = false;
    }
}
</script>

<template>
  <article class="break-inside-avoid mb-4 bg-carbon/40 border border-carbon rounded-lg p-4">
    <header class="flex items-center gap-3 mb-3">
      <RouterLink :to="`/usuario/${post.user_id}`" :aria-label="`Ver el perfil de ${post.profiles?.display_name ?? 'un usuario'}`">
        <Avatar :url="post.profiles?.avatar_url" :name="post.profiles?.display_name" :size="40" />
      </RouterLink>
      <div class="leading-tight">
        <RouterLink
          :to="`/usuario/${post.user_id}`"
          class="font-mono text-sm text-ivory hover:text-safelight transition-colors"
        >
          {{ post.profiles?.display_name ?? "Anónimo" }}
        </RouterLink>
        <time
          :datetime="post.created_at"
          :title="formatDate(post.created_at)"
          class="block font-mono text-[0.65rem] text-ash"
        >
          {{ formatRelative(post.created_at) }}
        </time>
      </div>
    </header>

    <!-- Modo edición -->
    <form v-if="editing" @submit.prevent="handleSave" class="mb-2">
      <label :for="`edit-${post.id}`" class="sr-only">Editar publicación</label>
      <textarea :id="`edit-${post.id}`" v-model="editContent" rows="3" required class="field mb-2"></textarea>
      <div class="flex gap-2">
        <button type="submit" class="btn-primary" :disabled="busy">Guardar</button>
        <button type="button" class="btn-ghost" @click="editing = false">Cancelar</button>
      </div>
    </form>

    <!-- Modo lectura -->
    <p v-else-if="post.content" class="text-ivory/90 whitespace-pre-line mb-3">
      {{ post.content }}
    </p>

    <img
      v-if="post.image_url"
      :src="post.image_url"
      :alt="`Foto de ${post.profiles?.display_name ?? 'un usuario'}`"
      loading="lazy"
      class="w-full rounded"
    />

    <!-- Acciones solo en posts propios -->
    <div v-if="isOwner && !editing" class="flex gap-2 mt-3">
      <button type="button" class="btn-ghost" @click="startEdit">Editar</button>
      <button type="button" class="btn-ghost" @click="handleDelete" :disabled="busy">Eliminar</button>
    </div>

    <p v-if="errorMessage" role="alert" aria-live="assertive" class="text-safelight text-sm mt-2">
      {{ errorMessage }}
    </p>

    <Comments :post-id="post.id" :current-user-id="currentUserId" />
  </article>
</template>
