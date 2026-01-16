import { createIndexedDBOfflineExecutor } from "~~/lib/offline";

export default defineNuxtPlugin({
    name: "offline-provider",
    async setup(nuxtApp) {
        const offline = await createIndexedDBOfflineExecutor();

        nuxtApp.provide("offline", offline);
    },
});
