import dotenv from 'dotenv';
import { createPool } from 'mysql2/promise';

dotenv.config();

const dbConfig = {
  host: isProduction ? process.env.PROD_DB_HOST : process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
};

const pool = createPool(dbConfig);

export default pool;
