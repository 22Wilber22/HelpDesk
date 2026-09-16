import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const useSsl = process.env.DB_SSL === 'true' || /railway|proxy\.rlwy\.net/.test(String(process.env.DB_HOST || ''));

const pool = createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS === 'true',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  maxIdle: parseInt(process.env.DB_MAXIDLE) || 10,
  idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT) || 60000,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
});

export default pool;