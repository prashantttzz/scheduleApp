import knex from 'knex';
import config from './knexfile.js';

const env = (process.env.NODE_ENV || "development") as "development" | "production";
const db = knex(config[env]);

export default db;