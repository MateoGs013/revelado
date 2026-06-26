<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { fetchComments, createComment, subscribeToNewComments } from "../services/comments";

const props = defineProps({
    postId: { type: String, required: true },
    currentUserId: { type: String, default: null },
});

const comments = ref([]);
const newContent = ref("");
const posting = ref(false);
const errorMessage = ref("");
let unsubscribe = () => {};

async function loadComments() {
    comments.value = await fetchComments(props.postId);
}

onMounted(async () => {
    try {
        await loadComments();
    } catch (error) {
        errorMessage.value = error.message;
    }
    // Realtime: cuando entra un comentario nuevo de este post, recargamos.
    unsubscribe = subscribeToNewComments(props.postId, loadComments);
});

onUnmounted(() => unsubscribe());

async function handleSubmit() {
    posting.value = true;
    errorMessage.value = "";
    try {
        await createComment({
            postId: props.postId,
            userId: props.currentUserId,
            content: newContent.value,
        });
        newContent.value = "";
    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        posting.value = false;
    }
}
</script>

<template>
  <section class="mt-4 border-t border-carbon pt-3">
    <h3 class="font-mono text-xs uppercase tracking-widest text-ash mb-3">Comentarios</h3>

    <ul v-if="comments.length" class="flex flex-col gap-2 mb-3">
      <li v-for="comment in comments" :key="comment.id" class="text-sm leading-snug">
        <span class="font-mono text-xs text-safelight">
          {{ comment.profiles?.display_name ?? "Anónimo" }}
        </span>
        <span class="text-ivory/90"> {{ comment.content }}</span>
      </li>
    </ul>
    <p v-else class="text-sm text-ash mb-3">Sé el primero en comentar.</p>

    <form v-if="currentUserId" @submit.prevent="handleSubmit" class="flex gap-2">
      <label :for="`comment-${postId}`" class="sr-only">Escribir un comentario</label>
      <input
        :id="`comment-${postId}`"
        v-model="newContent"
        required
        placeholder="Comentar…"
        class="field flex-1"
      />
      <button type="submit" class="btn-ghost" :disabled="posting">
        {{ posting ? "…" : "Enviar" }}
      </button>
    </form>

    <p v-if="errorMessage" role="alert" aria-live="assertive" class="text-safelight text-sm mt-2">
      {{ errorMessage }}
    </p>
  </section>
</template>
