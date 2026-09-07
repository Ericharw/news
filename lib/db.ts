import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://news_user:Ericha12_@localhost:5432/news",
});

export default pool;
