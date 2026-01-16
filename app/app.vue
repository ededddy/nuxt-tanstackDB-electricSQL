<script setup lang="ts">
const app = useNuxtApp();
const { $pwa } = app;
const toast = useToast();

// Track PWA state
const showInstallPrompt = ref(false);
const showUpdatePrompt = ref(false);
const isOffline = ref(false);

console.log($pwa?.showInstallPrompt);
console.log($pwa?.isInstalled);
// Handle install prompt
const installPWA = async () => {
    if ($pwa?.showInstallPrompt) {
        showInstallPrompt.value = true;
        toast.add({
            title: "Install App",
            description: "Install this app on your device for offline access",
            actions: [
                {
                    label: "Install",
                    onClick: async () => {
                        await $pwa.install();
                        showInstallPrompt.value = false;
                        toast.add({
                            title: "Installed!",
                            description: "App has been installed successfully",
                            color: "info",
                        });
                    },
                },
                {
                    label: "Cancel",
                    onClick: () => {
                        showInstallPrompt.value = false;
                    },
                },
            ],
            color: "primary",
        });
    }
};

// Handle service worker update
const updateSW = () => {
    if ($pwa?.needRefresh) {
        $pwa.updateServiceWorker();
        showUpdatePrompt.value = false;
    }
};

// Show offline status change
watch(() => $pwa?.offlineReady, (ready) => {
    if (ready) {
        toast.add({
            title: "Offline Ready",
            description: "App is ready to work offline",
            color: "secondary",
        });
    }
});

// Watch for update availability
watch(() => $pwa?.needRefresh, (needRefresh) => {
    if (needRefresh) {
        showUpdatePrompt.value = true;
        toast.add({
            title: "Update Available",
            description: "New version available. Please update to get the latest features.",
            actions: [
                {
                    label: "Update",
                    onClick: updateSW,
                },
                {
                    label: "Later",
                    onClick: () => {
                        showUpdatePrompt.value = false;
                    },
                },
            ],
            color: "warning",
        });
    }
});

// Watch for install prompt availability
watch(() => $pwa?.showInstallPrompt, (needPrompt) => {
    if (needPrompt) {
        installPWA();
    }
});

// Check if PWA is already installed on mount
onMounted(() => {
    if (!$pwa?.isPWAInstalled && $pwa?.showInstallPrompt) {
        installPWA();
    }
});
</script>

<template>
    <NuxtPwaManifest />

    <!-- Fallback update UI if toast doesn't show -->
    <div
        v-if="$pwa?.needRefresh && !showUpdatePrompt"
        class="fixed bottom-4 right-4 z-50 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded shadow-lg flex gap-3 items-center"
    >
        <span class="text-sm">
            New content available, click on reload button to update.
        </span>
        <button
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm font-medium"
            @click="updateSW"
        >
            Update
        </button>
    </div>

    <!-- Offline indicator -->
    <div
        v-if="isOffline"
        class="fixed top-4 left-4 z-50 bg-gray-100 border border-gray-400 text-gray-800 px-3 py-2 rounded shadow-lg text-sm"
    >
        You are offline
    </div>

    <NuxtPage />
</template>
