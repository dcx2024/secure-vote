require('dotenv').config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'pg',
    connection: {
      /* connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }*/
      
      host: 'localhost',
      user: process.env.DBUSER,
      password: process.env.DBPASSWORD,
      database: process.env.DBNAME,
      port:5432
      
    },
    migrations:{
      directory: './migrations'
    },
    seeds:{
      directory: './seeds'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
},
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
