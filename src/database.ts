import { createPool, Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const connect = createPool({
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  host: process.env.MYSQLHOST,
  port: parseInt(process.env.MYSQLPORT || ''),
  database: process.env.MYSQLDATABASE,
});
