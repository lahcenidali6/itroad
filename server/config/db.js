import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();
const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
});
console.log( process.env.DB_HOST)
export default db;