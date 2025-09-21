const config = {
  development: {
    client: 'pg',
    connection: {
      host: 'ep-winter-glade-ads484n5-pooler.c-2.us-east-1.aws.neon.tech',
      port: 5432,
      user: 'neondb_owner',
      password: 'npg_Eu0dMcho9Wzr',
      database: 'neondb',
      ssl: { rejectUnauthorized: false },
    },
    migrations: { directory: '../migrations' },
  },
  production: {
    client: 'pg',
    connection: {
      host: 'ep-winter-glade-ads484n5-pooler.c-2.us-east-1.aws.neon.tech',
      port: 5432,
      user: 'neondb_owner',
      password: 'npg_Eu0dMcho9Wzr',
      database: 'neondb',
      ssl: { rejectUnauthorized: false },
    },
    migrations: { directory: '../migrations' },
  },
};

export default config;
