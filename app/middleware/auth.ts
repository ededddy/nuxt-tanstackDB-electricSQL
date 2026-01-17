import { authClient } from "~~/lib/auth-client";

export default defineNuxtRouteMiddleware(async (to) => {
    // Get session from cookie (server-side check)
    const session = await authClient.getSession({
        fetchOptions: {
            headers: {
                cookie: useRequestHeaders(["cookie"]).cookie || "",
            },
        },
    });

    const hasSession = session.data !== null;

    // If no session and trying to access protected route
    if (!hasSession && to.path !== "/login") {
        return navigateTo("/login");
    }

    // If has session and trying to access login page, redirect to home
    if (hasSession && to.path === "/login") {
        return navigateTo("/");
    }
});
