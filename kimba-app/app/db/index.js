import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  // user: "kevinallred",
  // connectionString: "postgresql://kevinallred@localhost:5432/kimba_dev",
  // password: "",
  // host: "localhost",
  // port: 5432,
  database: "kimba_dev",
  // database: "leaderfactor_dev",
  // max: 20,
  // idleTimeoutMillis: 30000,
  // connectionTimeoutMillis: 2000,
});

export default pool;
