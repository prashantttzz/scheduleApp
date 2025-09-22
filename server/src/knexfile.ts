import dotenv from "dotenv";
dotenv.config();
const config = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST!,
      port: 5432,
      user: 'neondb_owner',
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_DATABASE!,
      ssl: { rejectUnauthorized: false },
    },
    migrations: { directory: '../migrations' },
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST!,
      port: 5432,
      user: 'neondb_owner',
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_DATABASE!,
      ssl: { rejectUnauthorized: false },
    },
    migrations: { directory: '../migrations' },
  },
};

export default config;
