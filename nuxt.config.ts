// https://nuxt.com/docs/api/configuration/nuxt-config
const sw = process.env.SW === "true";

export default defineNuxtConfig({
    modules: ["@nuxt/eslint", "@vite-pwa/nuxt", "@nuxt/ui", (_, nuxt) => {
        nuxt.hook("pwa:beforeBuildServiceWorker", (options) => {
            console.log("pwa:beforeBuildServiceWorker: ", options.base);
        });
    }],
    ssr: false,
    devtools: { enabled: false },
    css: ["~/assets/css/main.css"],
    experimental: {
        appManifest: true,
    },
    compatibilityDate: "2025-07-15",
    nitro: {
        prerender: {
            routes: ["/"],
        },
    },
    vite: {
        logLevel: "info",
    },
    eslint: {
        config: {
            stylistic: {
                semi: true,
                quotes: "double",
                commaDangle: "always-multiline",
                indent: 4,
            },
        },
    },
    pwa: {
        strategies: sw ? "injectManifest" : "generateSW",
        srcDir: sw ? "service-worker" : undefined,
        filename: sw ? "sw.ts" : undefined,
        registerType: "autoUpdate",
        injectRegister: "auto",
        manifest: {
            name: "Toy Todo TanstackDB",
            short_name: "ToyTodo",
            description: "A Nuxt 4 Progressive Web App",
            display: "standalone",
            prefer_related_applications: false,
            theme_color: "#4A90E2",
            screenshots: [
                {
                    src: "home-wide-1280x720.png",
                    sizes: "1280x720",
                    type: "image/png",
                    form_factor: "wide",
                    label: "Home screen in landscape",
                },
                {
                    src: "home-720x1280.png",
                    sizes: "720x1280",
                    type: "image/png",
                    label: "Home screen in other",
                },
            ],
            icons: [
                {
                    src: "icon-48x48.png",
                    sizes: "48x48",
                    type: "image/png",
                },
                {
                    src: "icon-72x72.png",
                    sizes: "72x72",
                    type: "image/png",
                },
                {
                    src: "icon-96x96.png",
                    sizes: "96x96",
                    type: "image/png",
                },
                {
                    src: "icon-128x128.png",
                    sizes: "128x128",
                    type: "image/png",
                },
                {
                    src: "icon-144x144.png",
                    sizes: "144x144",
                    type: "image/png",
                },
                {
                    src: "icon-152x152.png",
                    sizes: "152x152",
                    type: "image/png",
                },
                {
                    src: "icon-192x192.png",
                    sizes: "192x192",
                    type: "image/png",
                },
                {
                    src: "icon-256x256.png",
                    sizes: "256x256",
                    type: "image/png",
                },
                {
                    src: "icon-384x384.png",
                    sizes: "384x384",
                    type: "image/png",
                },
                {
                    src: "icon-512x512.png",
                    sizes: "512x512",
                    type: "image/png",
                },
            ],
        },
        devOptions: {
            enabled: true,
            suppressWarnings: true,
            navigateFallback: "/",
            navigateFallbackAllowlist: [/^\/$/],
            type: "module",
        },
        injectManifest: {
            globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
        },
        client: {
            installPrompt: true,
            // you don't need to include this: only for testing purposes
            // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
            periodicSyncForUpdates: 20,
        },
        workbox: {
            globPatterns: [
                "_nuxt/builds/**/*.json",
                "_nuxt/builds/**/*.js",
                "_nuxt/builds/**/*.ts",
                "**/*.{js,css,html,png,svg,ico}",
            ],
            runtimeCaching: [
                {
                    urlPattern: "http://localhost:3000/.*",
                    handler: "NetworkFirst",
                    // options: {
                    //     cacheName: "api-cache",
                    //     expiration: {
                    //         maxEntries: 50,
                    //         maxAgeSeconds: 86400,
                    //     },
                    // },
                },
            ],
        },
    },
});
