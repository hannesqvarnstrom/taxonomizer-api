import type { Knex } from "knex";
import * as dotenv from 'dotenv'
dotenv.config()
// Update with your config settings.
const isProduction = process.env.NODE_ENV === 'production'
const dbURL = process.env.DATABASE_URL
const connection = isProduction ? `${dbURL}?ssl=true` : dbURL
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
