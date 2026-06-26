<script setup>
import { computed } from "vue";

/*
  Avatar reutilizable: muestra la foto del usuario si existe, o un círculo
  con su inicial como fallback, para que nunca quede un hueco vacío en el feed.
*/
const props = defineProps({
    url: { type: String, default: null },
    name: { type: String, default: "" },
    size: { type: Number, default: 36 },
});

// Inicial para el fallback (primera letra del nombre, o "?" si no hay).
const initial = computed(() => (props.name?.trim()?.[0] ?? "?").toUpperCase());
</script>

<template>
  <img
    v-if="url"
    :src="url"
    :alt="`Avatar de ${name || 'usuario'}`"
    :width="size"
    :height="size"
    class="rounded-full object-cover shrink-0"
    :style="{ width: `${size}px`, height: `${size}px` }"
  />
  <!-- Fallback: el nombre real ya aparece al lado, por eso el círculo es decorativo. -->
  <span
    v-else
    aria-hidden="true"
    class="rounded-full shrink-0 grid place-items-center bg-carbon border border-ash/30 text-ash font-mono"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.4)}px` }"
  >
    {{ initial }}
  </span>
</template>
