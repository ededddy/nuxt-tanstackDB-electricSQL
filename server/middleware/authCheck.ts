import { auth } from "~~/server/lib/auth";

export default defineEventHandler(async (event) => {
    const url = getRequestURL(event);

    if (url.pathname.startsWith("/api/auth")) {
        console.log("[AUTH]: Public route. Skipping...");
        return;
    }

    const session = await auth.api.getSession({
        headers: event.headers,
    });

    if (!session) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "You must be logged in to access this resource",
        });
    }
    console.log(`[AUTH]: session: ${JSON.stringify(session)}`);
    return;
});
