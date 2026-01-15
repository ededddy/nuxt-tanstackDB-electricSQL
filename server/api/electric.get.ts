export default defineEventHandler(async (event) => {
    const baseUrl = new URL("/v1/shape", process.env.ELECTRIC_URL!);

    const query = getQuery(event);

    baseUrl.searchParams.set("source_id", process.env.ELECTRIC_SOURCE_ID!);
    baseUrl.searchParams.set("secret", process.env.ELECTRIC_SOURCE_SECRET!);

    Object.entries(query).forEach(([key, value]) => {
        baseUrl.searchParams.set(key, value);
    });

    const response = await fetch(baseUrl);
    // console.log(baseUrl);

    event.node.res.setHeaders(response.headers);
    event.node.res.statusCode = response.status;
    event.node.res.statusMessage = response.statusText;

    event.node.res.removeHeader("content-encoding");
    event.node.res.removeHeader("content-length");

    return response.body;
});
