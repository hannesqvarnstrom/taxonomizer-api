import type { Knex } from "knex";
import * as dotenv from 'dotenv'
dotenv.config()
// Update with your config settings.
// This is a fix to force knex to connect using ssl in production
// This is a requirement by Heroku.
// Read more at: https://github.com/tgriesser/knex/issues/852#issuecomment-229502678
import pg from 'pg'
if (['production', 'staging'].includes(process.env.NODE_ENV)) {
  pg.defaults.ssl = { rejectUnauthorized: false }
}

const dbURL = process.env.DATABASE_URL
const connection = dbURL

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection,
    migrations: {
      tableName: "migrations",
    },
  },

  production: {
    client: "pg",
    connection,
    migrations: {
      tableName: "migrations",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
  test: {
    client: 'pg',
    connection: process.env.TEST_DB_URL || {
      // host: process.env.TEST_HOST,
      database: process.env.TEST_DB,
      user: process.env.TEST_USER,
      password: process.env.TEST_PW
    },
    migrations: {
      tableName: 'migrations'
    }
  }
};

// module.exports = config
export default config
