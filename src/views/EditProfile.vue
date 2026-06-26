<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuth } from "../services/useAuth";
import { fetchProfile, updateProfile } from "../services/profiles";
import { uploadAvatar } from "../services/storage";
import Avatar from "../components/Avatar.vue";

const { user, updatePassword } = useAuth();

const displayName = ref("");
const bio = ref("");
const avatarFile = ref(null);
const avatarUrl = ref(null);      // foto de perfil guardada actualmente
const avatarPreview = ref(null);  // preview local del archivo recién elegido (antes de guardar)
const newPassword = ref("");

const loading = ref(true);
const saving = ref(false);
const message = ref("");
const errorMessage = ref("");

onMounted(async () => {
    try {
        const profile = await fetchProfile(user.value.id);
        displayName.value = profile.display_name ?? "";
        bio.value = profile.bio ?? "";
        avatarUrl.value = profile.avatar_url ?? null;
    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        loading.value = false;
    }
});

function handleAvatarChange(event) {
    const file = event.target.files[0] ?? null;
    avatarFile.value = file;
    // Generamos un preview local para ver la foto antes de subirla.
    if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value);
    avatarPreview.value = file ? URL.createObjectURL(file) : null;
}

// Liberamos el preview al salir de la vista (evita fugas de memoria).
onUnmounted(() => {
    if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value);
});

async function handleSaveProfile() {
    saving.value = true;
    message.value = "";
    errorMessage.value = "";
    try {
        const data = { display_name: displayName.value, bio: bio.value };
        // Si eligió un avatar nuevo, lo subimos y guardamos su URL.
        if (avatarFile.value) {
            data.avatar_url = await uploadAvatar(avatarFile.value, user.value.id);
            avatarUrl.value = data.avatar_url; // reflejamos la foto nueva al instante
        }
        await updateProfile(user.value.id, data);
        avatarFile.value = null;
        // Limpiamos el preview: la foto guardada ya es la nueva.
        if (avatarPreview.value) {
            URL.revokeObjectURL(avatarPreview.value);
            avatarPreview.value = null;
        }
        message.value = "Perfil actualizado.";
    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        saving.value = false;
    }
}

async function handleChangePassword() {
    saving.value = true;
    message.value = "";
    errorMessage.value = "";
    try {
        await updatePassword(newPassword.value);
        newPassword.value = "";
        message.value = "Contraseña actualizada.";
    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        saving.value = false;
    }
}
</script>

<template>
  <main class="max-w-sm mx-auto px-4 py-8">
    <h1 class="font-display text-4xl text-ivory mb-8">Mi perfil</h1>

    <p v-if="loading" class="font-mono text-sm text-ash">Cargando…</p>

    <template v-else>
      <!-- Datos del perfil -->
      <form @submit.prevent="handleSaveProfile" class="flex flex-col gap-4 mb-10">
        <div>
          <label for="displayName" class="label">Nombre</label>
          <input type="text" id="displayName" v-model="displayName" required class="field" />
        </div>
        <div>
          <label for="bio" class="label">Bio</label>
          <textarea id="bio" v-model="bio" rows="2" class="field"></textarea>
        </div>
        <div>
          <label for="avatar" class="label">Avatar</label>
          <div class="flex items-center gap-4">
            <Avatar :url="avatarPreview ?? avatarUrl" :name="displayName" :size="72" />
            <input
              type="file"
              id="avatar"
              accept="image/*"
              @change="handleAvatarChange"
              class="block w-full font-mono text-xs text-ash file:mr-3 file:rounded file:border file:border-ash/40 file:bg-transparent file:text-ivory file:px-3 file:py-1.5 file:uppercase file:cursor-pointer hover:file:border-safelight"
            />
          </div>
        </div>
        <button type="submit" class="btn-primary" :disabled="saving">Guardar perfil</button>
      </form>

      <!-- Cambiar contraseña -->
      <form @submit.prevent="handleChangePassword" class="flex flex-col gap-4 border-t border-carbon pt-8">
        <h2 class="font-mono text-xs uppercase tracking-widest text-ash">Cambiar contraseña</h2>
        <div>
          <label for="newPassword" class="label">Nueva contraseña</label>
          <input type="password" id="newPassword" v-model="newPassword" required autocomplete="new-password" minlength="6" class="field" />
        </div>
        <button type="submit" class="btn-ghost" :disabled="saving">Actualizar contraseña</button>
      </form>

      <p v-if="message" role="status" aria-live="polite" class="text-safelight text-sm mt-4">{{ message }}</p>
      <p v-if="errorMessage" role="alert" aria-live="assertive" class="text-safelight text-sm mt-4">{{ errorMessage }}</p>
    </template>
  </main>
</template>
