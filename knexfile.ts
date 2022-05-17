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
const isProduction = process.env.NODE_ENV === 'production'
const dbURL = process.env.DATABASE_URL
const connection = dbURL

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "postgresql",
        connection,
        migrations: {
            tableName: "migrations",
        },
    },

    production: {
        client: "postgresql",
        connection,
        migrations: {
            tableName: "migrations",
        },
        pool: {
            min: 2,
            max: 10,
        },
    },
};

export default config
