export default defineEventHandler(async (event) => {
    try {
        // Validate required query parameters from client
        const query = getQuery(event);

        if (!query.table) {
            throw createError({
                statusCode: 400,
                statusMessage: "Missing required parameter: table",
            });
        }

        if (!query.offset) {
            throw createError({
                statusCode: 400,
                statusMessage: "Missing required parameter: offset",
            });
        }

        // Build ElectricSQL URL with authentication
        const baseUrl = new URL("/v1/shape", process.env.ELECTRIC_URL!);
        baseUrl.searchParams.set("source_id", process.env.ELECTRIC_SOURCE_ID!);
        baseUrl.searchParams.set("secret", process.env.ELECTRIC_SOURCE_SECRET!);

        // Forward client query parameters
        Object.entries(query).forEach(([key, value]) => {
            baseUrl.searchParams.set(key, value);
        });

        // console.log("ElectricSQL proxy request:", baseUrl.toString().replace(process.env.ELECTRIC_SOURCE_SECRET!, "***"));

        // Fetch from ElectricSQL
        const response = await fetch(baseUrl);

        if (!response.ok) {
            console.error("ElectricSQL error:", response.status, response.statusText);
            throw createError({
                statusCode: response.status,
                statusMessage: `Internal Server Error`,
                message: `ElectricSQL error: ${response.statusText}`,
            });
        }

        // Copy all headers from ElectricSQL response (required for client-side ElectricSQL client)
        response.headers.forEach((value, key) => {
            // Skip problematic headers that shouldn't be forwarded
            if (key !== "content-encoding" && key !== "content-length" && key !== "transfer-encoding") {
                event.node.res.setHeader(key, value);
            }
        });

        // Set status code
        event.node.res.statusCode = response.status;
        event.node.res.statusMessage = response.statusText;

        // Stream the response body
        if (response.body) {
            return sendStream(event, response.body);
        }

        return null;
    }
    catch (error) {
        // Log error for debugging
        console.error("ElectricSQL proxy error:", error);

        // Re-throw Nuxt errors
        throw error;
    }
});
