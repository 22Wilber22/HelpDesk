import { createPool } from "mysql2/promise";

const pool = createPool({
  host: 'blatiuba37fi6gacxdrt-mysql.services.clever-cloud.com',
  user: 'uhjd30dgvb8lsdzv',
  password: 'm6lmCi5FC70OoD14a5v6',
  database: 'blatiuba37fi6gacxdrt',
  waitForConnections: true,
  connectionLimit: 10,   // máximo de conexiones abiertas
  queueLimit: 0          // sin límite en la cola de espera
});

export default pool;
