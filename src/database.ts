import { createPool, Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export async function connect(): Promise<Pool> {
  const connection = await createPool({
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    host: process.env.MYSQLHOST,
    port: parseInt(process.env.MYSQLPORT || ''),
    database: process.env.MYSQLDATABASE,
  });
  return connection;
}
