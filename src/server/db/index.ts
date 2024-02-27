import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env.js";
import * as schema from "./schema";

// Prevents "too many clients" error in development
declare global {
  // Only var (not const/let) works here
  // eslint-disable-next-line no-var
  var db: PostgresJsDatabase<typeof schema> | undefined;
}

let db: PostgresJsDatabase<typeof schema>;

if (process.env.NODE_ENV === "production") {
  db = drizzle(postgres(env.DATABASE_URL), { schema });
} else {
  if (!global.db) {
    global.db = drizzle(postgres(env.DATABASE_URL), { schema });
  }

  db = global.db;
}

export { db };
