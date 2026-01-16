import type { OfflineExecutor } from "@tanstack/offline-transactions";
import { createOfflineActions } from "~~/lib/offline";

export default defineNuxtPlugin({
    name: "todo-actions-provider",
    async setup(nuxtApp) {
        console.log("[OFFLINE ACTIONS] Plugin running", Date.now());
        const offline = nuxtApp.$offline;
        console.log("[OFFLINE ACTIONS] $offline available?", !!offline);
        const actions = createOfflineActions(offline as OfflineExecutor);

        console.log("[OFFLINE ACTIONS] Actions created", Object.keys(actions));

        nuxtApp.provide(`todoActions`, actions);
    },
});
