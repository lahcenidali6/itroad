import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: '12345',
    database: 'itroad'
  }
});

export default db;