// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// const pool = new Pool({
//    connectionString: process.env.POSTGRES_URL!,
//    database: process.env.POSTGRES_DATABASE!,
// });
// const db = drizzle(pool, {
// });

import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "./postgres";

const db = drizzle({
    client: sql,
});

export default db;
